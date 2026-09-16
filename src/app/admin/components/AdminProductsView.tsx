'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

export default function AdminProductsView() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    fetch('/api/admin/products').then((r) => r.json()).then((json) => setProducts(json?.data?.products ?? []));
  };
  useEffect(load, []);

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
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black uppercase text-3xl text-foreground">Products & Inventory</h1>
        <Link href="/admin/products/new" className="btn-dark py-2.5 px-5 text-xs">+ Add Product</Link>
      </div>

      {!products ? (
        <div className="mt-6 animate-pulse h-64" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
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
              {products.map((p) => (
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
        </div>
      )}
    </div>
  );
}
