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

  useEffect(() => {
    // Redirect to login if not authenticated (except on login/signup pages)
    const path = window.location.pathname;
    if (!isAuthenticated && path !== '/login' && path !== '/signup') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
