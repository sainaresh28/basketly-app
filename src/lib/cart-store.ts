'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ToastMessage } from '@/types';

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  toasts: ToastMessage[];
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  /** Pulls the authoritative cart from the server (call after login). */
  hydrateFromServer: () => Promise<void>;
  /** Pushes whatever is currently in local storage up to the server (call once, right after login). */
  mergeGuestCartToServer: () => Promise<void>;
}

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      toasts: [],
      isAuthenticated: false,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      addItem: (product, quantity = 1) => {
        const existing = get().items.find(i => i.productId === product.id);
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.productId === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                : i
            ),
          }));
        } else {
          set(state => ({
            items: [...state.items, { productId: product.id, product, quantity: Math.min(quantity, product.stock) }],
          }));
        }
        get().addToast(`${product.name} added to cart`, 'success');
        set({ isDrawerOpen: true });

        // Best-effort sync to the backend. The local state above already
        // reflects the change (optimistic UI), so a slow/failed request
        // doesn't block the shopping experience. We always attempt this —
        // rather than gating it on the client's `isAuthenticated` flag —
        // because that flag is only known for certain once /api/auth/me
        // resolves on load; adding an item before that finishes would
        // otherwise skip the sync entirely and silently desync the local
        // cart from the server cart. A 401 here just means the shopper is
        // a guest, which is expected and not an error.
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity }),
        })
          .then((res) => {
            if (!res.ok && res.status !== 401) {
              get().addToast('Could not sync your cart — check your connection', 'error');
            }
          })
          .catch(() => {
            if (get().isAuthenticated) {
              get().addToast('Could not sync your cart — check your connection', 'error');
            }
          });
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.productId !== productId) }));
        get().addToast('Item removed from cart', 'info');

        fetch(`/api/cart/${productId}`, { method: 'DELETE' })
          .then((res) => {
            if (!res.ok && res.status !== 401) {
              get().addToast('Could not sync your cart — check your connection', 'error');
            }
          })
          .catch(() => {
            if (get().isAuthenticated) {
              get().addToast('Could not sync your cart — check your connection', 'error');
            }
          });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i
          ),
        }));

        fetch(`/api/cart/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        })
          .then((res) => {
            if (!res.ok && res.status !== 401) {
              get().addToast('Could not sync your cart — check your connection', 'error');
            }
          })
          .catch(() => {
            if (get().isAuthenticated) {
              get().addToast('Could not sync your cart — check your connection', 'error');
            }
          });
      },

      clearCart: () => {
        set({ items: [] });
        fetch('/api/cart', { method: 'DELETE' }).catch(() => {});
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addToast: (message, type = 'success') => {
        const id = Math.random().toString(36).slice(2);
        set(state => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 3500);
      },

      removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      hydrateFromServer: async () => {
        try {
          const res = await fetch('/api/cart');
          const json = await parseJson(res);
          if (json?.success) set({ items: json.data.cart.items });
        } catch {
          // keep whatever is currently in local state if the fetch fails
        }
      },

      mergeGuestCartToServer: async () => {
        const localItems = get().items;
        if (localItems.length === 0) return;
        try {
          await fetch('/api/cart/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: localItems.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                selectedSize: i.selectedSize,
                selectedColor: i.selectedColor,
              })),
            }),
          });
        } catch {
          // if merging fails, the local cart is left untouched
        }
      },
    }),
    { name: 'basketly-cart', partialize: (state) => ({ items: state.items }) }
  )
);