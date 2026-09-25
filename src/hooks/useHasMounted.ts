'use client';
import { useEffect, useState } from 'react';

/**
 * Returns false during the server render and the first client render (the
 * one React uses to check against the server-rendered HTML), then flips to
 * true right after hydration. Use this to gate any UI that depends on
 * client-only state — most commonly a Zustand `persist` store, which reads
 * from localStorage — so the very first render matches on both sides and
 * React doesn't throw a hydration mismatch.
 */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
