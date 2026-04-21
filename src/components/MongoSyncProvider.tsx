"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useStore();

  useEffect(() => {
    // Check authentication on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect to login if not authenticated (except on login/signup pages)
    const path = window.location.pathname;
    if (!isAuthenticated && path !== '/login' && path !== '/signup') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
