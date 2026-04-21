"use client";

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export function useMongoSync() {
  const syncFromDB = useStore((state) => state.syncFromDB);
  const syncToDB = useStore((state) => state.syncToDB);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Select state to watch for changes
  const bookmarks = useStore((state) => state.bookmarks);
  const mistakes = useStore((state) => state.mistakes);
  const examState = useStore((state) => state.examState);
  const practiceProgress = useStore((state) => state.practiceProgress);
  const conceptProgress = useStore((state) => state.conceptProgress);
  const darkMode = useStore((state) => state.darkMode);
  const searchQuery = useStore((state) => state.searchQuery);

  // Load data from MongoDB on mount
  useEffect(() => {
    syncFromDB();
  }, [syncFromDB]);

  // Debounced sync to MongoDB on any state change
  useEffect(() => {
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
  }, [bookmarks, mistakes, examState, practiceProgress, conceptProgress, darkMode, searchQuery, syncToDB]);
}
