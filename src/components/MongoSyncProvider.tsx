"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { checkAuth, isAuthenticated, syncFromDB, syncToDB } = useStore();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [bookmarks, mistakes, examState, practiceProgress, conceptProgress, darkMode, searchQuery, syncToDB, isAuthenticated]);

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

  useEffect(() => {
    // Redirect to login if not authenticated (except on login/signup pages)
    const path = window.location.pathname;
    if (!isAuthenticated && path !== '/login' && path !== '/signup') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
