'use client';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

/** Keeps <html class="dark"> in sync with the signed-in user's saved theme preference. */
export default function ThemeSync() {
  const { user } = useAuth();

  useEffect(() => {
    const theme = user?.preferences?.theme ?? (typeof window !== 'undefined' ? localStorage.getItem('basketly-theme') : null) ?? 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (typeof window !== 'undefined') localStorage.setItem('basketly-theme', theme);
  }, [user?.preferences?.theme]);

  return null;
}
