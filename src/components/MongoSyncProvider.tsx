"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

const LOCAL_STORAGE_KEY = 'simmaster-data-backup';

// Save to localStorage
const saveToLocalStorage = (data: any) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load from localStorage
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { checkAuth, isAuthenticated, syncFromDB, syncToDB } = useStore();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedFromLocalStorage = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (hasLoadedFromLocalStorage.current) return;
    hasLoadedFromLocalStorage.current = true;

    const localData = loadFromLocalStorage();
    if (localData) {
      console.log('Loading data from localStorage:', localData);
      useStore.setState({
        bookmarks: localData.bookmarks || [],
        mistakes: localData.mistakes || [],
        examState: localData.examState || {
          isActive: false,
          questions: [],
          currentQuestion: 0,
          answers: {},
          startTime: 0,
          timeLimit: 60,
        },
        practiceProgress: localData.practiceProgress || {},
        conceptProgress: localData.conceptProgress || {},
        darkMode: localData.darkMode || false,
        searchQuery: localData.searchQuery || "",
        justPassMode: localData.justPassMode || false,
        formulaMastery: localData.formulaMastery || {},
      });
    }
  }, []);

  useEffect(() => {
    // Check authentication on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Sync data from MongoDB after authentication is confirmed
    if (isAuthenticated) {
      syncFromDB();
    }
  }, [isAuthenticated, syncFromDB]);

  // Select state to watch for changes
  const bookmarks = useStore((state) => state.bookmarks);
  const mistakes = useStore((state) => state.mistakes);
  const examState = useStore((state) => state.examState);
  const practiceProgress = useStore((state) => state.practiceProgress);
  const conceptProgress = useStore((state) => state.conceptProgress);
  const darkMode = useStore((state) => state.darkMode);
  const searchQuery = useStore((state) => state.searchQuery);
  const justPassMode = useStore((state) => state.justPassMode);
  const formulaMastery = useStore((state) => state.formulaMastery);

  // Save to localStorage on every state change
  useEffect(() => {
    const state = useStore.getState();
    const dataToSave = {
      bookmarks: state.bookmarks,
      mistakes: state.mistakes,
      examState: state.examState,
      practiceProgress: state.practiceProgress,
      conceptProgress: state.conceptProgress,
      darkMode: state.darkMode,
      searchQuery: state.searchQuery,
      justPassMode: state.justPassMode,
      formulaMastery: state.formulaMastery,
    };
    saveToLocalStorage(dataToSave);
  }, [bookmarks, mistakes, examState, practiceProgress, conceptProgress, darkMode, searchQuery, justPassMode, formulaMastery]);

  // Debounced sync to MongoDB on any state change
  useEffect(() => {
    if (!isAuthenticated) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncToDB();
    }, 1000); // Sync after 1 second of inactivity

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [bookmarks, mistakes, examState, practiceProgress, conceptProgress, darkMode, searchQuery, justPassMode, formulaMastery, syncToDB, isAuthenticated]);

  // Sync on page unload to prevent data loss
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleBeforeUnload = () => {
      // Use navigator.sendBeacon for reliable sync on page unload
      const state = useStore.getState();
      const userId = state.user?.userId || localStorage.getItem('simmaster-user-id');

      if (userId) {
        const data = {
          userId,
          bookmarks: state.bookmarks,
          mistakes: state.mistakes,
          examState: state.examState,
          practiceProgress: state.practiceProgress,
          conceptProgress: state.conceptProgress,
          darkMode: state.darkMode,
          searchQuery: state.searchQuery,
          justPassMode: state.justPassMode,
          formulaMastery: state.formulaMastery,
        };

        // Use sendBeacon for reliable sync during page unload
        navigator.sendBeacon('/api/user', new Blob([JSON.stringify(data)], {
          type: 'application/json',
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated]);

  // REMOVED: Auth gate - app should work without login (localStorage-first)
  // useEffect(() => {
  //   const path = window.location.pathname;
  //   if (!isAuthenticated && path !== '/login' && path !== '/signup') {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  return <>{children}</>;
}
