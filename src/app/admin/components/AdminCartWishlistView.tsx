'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { formatPrice } from '@/utils/format';
import Pagination from './ui/Pagination';
import { usePagination } from '@/hooks/usePagination';

interface CartRow {
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  lineTotal: number;
  addedAt: string;
  updatedAt: string;
}

interface WishlistRow {
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage?: string;
  productPrice: number;
  addedAt: string;
}

export default function AdminCartWishlistView() {
  const [tab, setTab] = useState<'cart' | 'wishlist'>('cart');
  const [cartRows, setCartRows] = useState<CartRow[] | null>(null);
  const [wishlistRows, setWishlistRows] = useState<WishlistRow[] | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/cart').then((r) => r.json()).then((json) => setCartRows(json?.data?.items ?? []));
    fetch('/api/admin/wishlist').then((r) => r.json()).then((json) => setWishlistRows(json?.data?.items ?? []));
  }, []);

  const filteredCart = useMemo(() => {
    if (!cartRows) return [];
    const q = search.trim().toLowerCase();
    if (!q) return cartRows;
    return cartRows.filter(
      (r) => r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q)
    );
  }, [cartRows, search]);

  const filteredWishlist = useMemo(() => {
    if (!wishlistRows) return [];
    const q = search.trim().toLowerCase();
    if (!q) return wishlistRows;
    return wishlistRows.filter(
      (r) => r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q)
    );
  }, [wishlistRows, search]);

  const cartPagination = usePagination(filteredCart);
  const wishlistPagination = usePagination(filteredWishlist);
  useEffect(() => {
    cartPagination.setPage(1);
    wishlistPagination.setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tab]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display font-black uppercase text-3xl text-foreground">Cart & Wishlist</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user or product…"
          className="w-full max-w-sm rounded-xl border border-border px-4 py-2.5 text-sm"
        />
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab('cart')}
          className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${tab === 'cart' ? 'bg-foreground text-background' : 'bg-secondary/40 text-muted-foreground'}`}>
          Cart ({cartRows?.length ?? '…'})
        </button>
        <button
          onClick={() => setTab('wishlist')}
          className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${tab === 'wishlist' ? 'bg-foreground text-background' : 'bg-secondary/40 text-muted-foreground'}`}>
          Wishlist ({wishlistRows?.length ?? '…'})
        </button>
      </div>

      {tab === 'cart' ? (
        !cartRows ? (
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
        ) : filteredCart.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">{cartRows.length === 0 ? 'No items in any cart right now.' : 'No matches.'}</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-bold">User</th>
                  <th className="px-4 py-3 font-bold">Product</th>
                  <th className="px-4 py-3 font-bold">Qty</th>
                  <th className="px-4 py-3 font-bold">Line Total</th>
                  <th className="px-4 py-3 font-bold">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {cartPagination.paged.map((r) => (
                  <tr key={`${r.userId}-${r.productId}`} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{r.userName}</div>
                      <div className="text-xs text-muted-foreground">{r.userEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-[220px] truncate">{r.productName}</td>
                    <td className="px-4 py-3 text-foreground">{r.quantity}</td>
                    <td className="px-4 py-3 text-foreground">{formatPrice(r.lineTotal)}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(r.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={cartPagination.page}
              totalPages={cartPagination.totalPages}
              totalItems={cartPagination.totalItems}
              pageSize={cartPagination.pageSize}
              onPageChange={cartPagination.setPage}
            />
          </div>
        )
      ) : !wishlistRows ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
      ) : filteredWishlist.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{wishlistRows.length === 0 ? 'No wishlist activity yet.' : 'No matches.'}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">User</th>
                <th className="px-4 py-3 font-bold">Product</th>
                <th className="px-4 py-3 font-bold">Price</th>
                <th className="px-4 py-3 font-bold">Added</th>
              </tr>
            </thead>
            <tbody>
              {wishlistPagination.paged.map((r) => (
                <tr key={`${r.userId}-${r.productId}`} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">{r.userName}</div>
                    <div className="text-xs text-muted-foreground">{r.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-foreground max-w-[220px] truncate">{r.productName}</td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(r.productPrice)}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(r.addedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={wishlistPagination.page}
            totalPages={wishlistPagination.totalPages}
            totalItems={wishlistPagination.totalItems}
            pageSize={wishlistPagination.pageSize}
            onPageChange={wishlistPagination.setPage}
          />
        </div>
      )}
    </div>
  );
}
