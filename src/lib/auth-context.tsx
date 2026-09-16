'use client';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { User } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * zustand's `persist` middleware restores localStorage asynchronously, on
 * mount, in parallel with everything else. If we merge the guest cart to the
 * server before that restore finishes, `get().items` is still `[]` and we
 * merge nothing — even though the UI shows items a moment later once the
 * restore completes. This waits for that restore before we read the store.
 */
function waitForHydration(store: {
  persist: { hasHydrated: () => boolean; onFinishHydration: (cb: () => void) => () => void };
}): Promise<void> {
  return new Promise((resolve) => {
    if (store.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsubscribe = store.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasMergedGuestData = useRef(false);

  const hydrateCart = useCartStore((s) => s.hydrateFromServer);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCartToServer);
  const setCartAuthenticated = useCartStore((s) => s.setAuthenticated);
  const hydrateWishlist = useWishlistStore((s) => s.hydrateFromServer);
  const mergeGuestWishlist = useWishlistStore((s) => s.mergeGuestWishlistToServer);
  const setWishlistAuthenticated = useWishlistStore((s) => s.setAuthenticated);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/auth/me');
    const json = await parseJson(res);
    const nextUser = json?.data?.user ?? null;
    setUser(nextUser);
    setCartAuthenticated(!!nextUser);
    setWishlistAuthenticated(!!nextUser);
    return nextUser;
  }, [setCartAuthenticated, setWishlistAuthenticated]);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once we know someone is signed in, fold their guest cart/wishlist
  // (kept in localStorage) into their account exactly once per session.
  useEffect(() => {
    if (!user || hasMergedGuestData.current) return;
    hasMergedGuestData.current = true;
    (async () => {
      await Promise.all([waitForHydration(useCartStore), waitForHydration(useWishlistStore)]);
      await mergeGuestCart();
      await mergeGuestWishlist();
      await hydrateCart();
      await hydrateWishlist();
    })();
  }, [user, mergeGuestCart, mergeGuestWishlist, hydrateCart, hydrateWishlist]);

  const register: AuthContextValue['register'] = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await parseJson(res);
    if (!res.ok || !json?.success) {
      return { ok: false, message: json?.error?.message || 'Could not create your account' };
    }
    setUser(json.data.user);
    return { ok: true };
  };

  const login: AuthContextValue['login'] = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await parseJson(res);
    if (!res.ok || !json?.success) {
      return { ok: false, message: json?.error?.message || 'Invalid email or password' };
    }
    setUser(json.data.user);
    return { ok: true };
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setCartAuthenticated(false);
    setWishlistAuthenticated(false);
    hasMergedGuestData.current = false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}