'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/utils/format';
import { SearchIcon } from './ui/icons';
import Pagination from './ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import type { Product } from '@/types';

export default function AdminProductsView() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const load = () => {
    fetch('/api/admin/products').then((r) => r.json()).then((json) => setProducts(json?.data?.products ?? []));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!products) return null;
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.categoryName.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term)
    );
  }, [products, query]);

  const { page, setPage, totalPages, pageSize, paged, totalItems } = usePagination(filtered ?? []);
  useEffect(() => setPage(1), [query, setPage]);

  const handleStockChange = async (product: Product, stock: number) => {
    setBusyId(product.id);
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock }),
    });
    setBusyId(null);
    load();
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setBusyId(product.id);
    await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    setBusyId(null);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-black uppercase text-3xl text-foreground">Products & Inventory</h1>
        <Link href="/admin/products/new" className="btn-dark py-2.5 px-5 text-xs">+ Add Product</Link>
      </div>

      <label className="relative mt-4 block max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={16} height={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="Search by name, category or brand..."
          className="w-full rounded-xl border border-border bg-muted/60 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </label>

      {!filtered ? (
        <div className="mt-6 animate-pulse h-64 rounded-2xl bg-muted" />
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No products match &quot;{query}&quot;.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Product</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Price</th>
                <th className="px-4 py-3 font-bold">Stock</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-foreground max-w-[240px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.categoryName}</td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      defaultValue={p.stock}
                      disabled={busyId === p.id}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val !== p.stock && val >= 0) handleStockChange(p, val);
                      }}
                      className={`w-20 rounded-lg border px-2 py-1 text-sm ${p.stock === 0 ? 'border-primary text-primary' : p.stock <= 5 ? 'border-amber-400' : 'border-border'}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-xs font-bold text-foreground hover:text-primary mr-4">Edit</Link>
                    <button onClick={() => handleDelete(p)} disabled={busyId === p.id} className="text-xs font-bold text-primary">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
