'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Pagination from './ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import type { Category } from '@/types';

export default function AdminCategoriesView() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    fetch('/api/admin/categories').then((r) => r.json()).then((json) => setCategories(json?.data?.categories ?? []));
  };
  useEffect(load, []);

  const visible = useMemo(() => {
    if (!categories) return [];
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [categories, search]);

  const { page, setPage, totalPages, pageSize, paged, totalItems } = usePagination(visible);
  useEffect(() => setPage(1), [search, setPage]);

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete "${category.name}"? This can't be undone.`)) return;
    setError('');
    setBusyId(category.id);
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok || !json.success) {
      setError(json?.error?.message || 'Could not delete category');
      return;
    }
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display font-black uppercase text-3xl text-foreground">Categories</h1>
        <Link href="/admin/categories/new" className="btn-dark py-2.5 px-5 text-xs">+ Add Category</Link>
      </div>

      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full max-w-sm rounded-xl border border-border px-4 py-2.5 text-sm"
        />
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary">{error}</p>}

      {!categories ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
      ) : visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {categories.length === 0 ? 'No categories yet — create your first one.' : 'No categories match your search.'}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Slug</th>
                <th className="px-4 py-3 font-bold">Products</th>
                <th className="px-4 py-3 font-bold">Featured</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-foreground max-w-[240px] truncate">
                    <div className="flex items-center gap-3">
                      {c.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt="" className="h-9 w-9 rounded-lg object-cover shrink-0" />
                      )}
                      <span className="truncate">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3 text-foreground">{c.productCount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.featured ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/categories/${c.id}/edit`} className="text-xs font-bold text-foreground hover:text-primary mr-4">Edit</Link>
                    <button onClick={() => handleDelete(c)} disabled={busyId === c.id} className="text-xs font-bold text-primary disabled:opacity-60">
                      {busyId === c.id ? 'Deleting…' : 'Delete'}
                    </button>
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
