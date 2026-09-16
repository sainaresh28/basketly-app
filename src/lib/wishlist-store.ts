'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem, Product } from '@/types';

interface WishlistStore {
  items: WishlistItem[];
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => boolean;
  isWishlisted: (productId: string) => boolean;
  getCount: () => number;
  hydrateFromServer: () => Promise<void>;
  mergeGuestWishlistToServer: () => Promise<void>;
}

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isAuthenticated: false,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      addItem: (product) => {
        if (!get().isWishlisted(product.id)) {
          set(state => ({
            items: [...state.items, {
              productId: product.id,
              product,
              addedAt: new Date().toISOString(),
            }],
          }));

          if (get().isAuthenticated) {
            fetch('/api/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: product.id }),
            }).catch(() => {});
          }
        }
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.productId !== productId) }));
        if (get().isAuthenticated) {
          fetch(`/api/wishlist/${productId}`, { method: 'DELETE' }).catch(() => {});
        }
      },

      toggleItem: (product) => {
        const wishlisted = get().isWishlisted(product.id);
        if (wishlisted) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },

      isWishlisted: (productId) => get().items.some(i => i.productId === productId),
      getCount: () => get().items.length,

      hydrateFromServer: async () => {
        try {
          const res = await fetch('/api/wishlist');
          const json = await parseJson(res);
          if (json?.success) set({ items: json.data.items });
        } catch {
          // keep local state on failure
        }
      },

      mergeGuestWishlistToServer: async () => {
        const localItems = get().items;
        if (localItems.length === 0) return;
        try {
          await fetch('/api/wishlist/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds: localItems.map(i => i.productId) }),
          });
        } catch {
          // if merging fails, the local wishlist is left untouched
        }
      },
    }),
    { name: 'basketly-wishlist', partialize: (state) => ({ items: state.items }) }
  )
);
