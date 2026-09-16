'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Product } from '@/types';

type FormState = {
  name: string; slug: string; description: string; price: string; originalPrice: string;
  categoryId: string; images: string; stock: string; brand: string; tags: string;
  isNew: boolean; isBestSeller: boolean; isSale: boolean;
};

function toFormState(p?: Product): FormState {
  return {
    name: p?.name ?? '', slug: p?.slug ?? '', description: p?.description ?? '',
    price: p ? String(p.price) : '', originalPrice: p?.originalPrice ? String(p.originalPrice) : '',
    categoryId: p?.categoryId ?? '', images: p?.images?.join(', ') ?? '',
    stock: p ? String(p.stock) : '0', brand: p?.brand ?? '',
    tags: p?.tags?.join(', ') ?? '',
    isNew: !!p?.isNew, isBestSeller: !!p?.isBestSeller, isSale: !!p?.isSale,
  };
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((json) => setCategories(json?.data?.categories ?? []));
  }, []);

  const set = <K extends keyof FormState>(key: K) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const category = categories.find((c) => c.id === form.categoryId);
    if (!category) {
      setError('Please choose a category');
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      categoryId: category.id,
      categoryName: category.name,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      brand: form.brand,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      isSale: form.isSale,
    };

    setSaving(true);
    const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : '/api/admin/products', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);

    if (!res.ok || !json.success) {
      setError(json?.error?.message || 'Could not save product');
      return;
    }
    router.push('/admin/products');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Product name" value={form.name} onChange={set('name')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
        <input placeholder="URL slug (auto-generated if left blank)" value={form.slug} onChange={set('slug')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
        <textarea required placeholder="Description" value={form.description} onChange={set('description')} rows={4}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
        <input required type="number" min={0} step="0.01" placeholder="Price" value={form.price} onChange={set('price')}
          className="rounded-xl border border-border px-4 py-3 text-sm" />
        <input type="number" min={0} step="0.01" placeholder="Original price (optional, for sale badge)" value={form.originalPrice} onChange={set('originalPrice')}
          className="rounded-xl border border-border px-4 py-3 text-sm" />
        <input required type="number" min={0} placeholder="Stock quantity" value={form.stock} onChange={set('stock')}
          className="rounded-xl border border-border px-4 py-3 text-sm" />
        <input required placeholder="Brand" value={form.brand} onChange={set('brand')}
          className="rounded-xl border border-border px-4 py-3 text-sm" />
        <select required value={form.categoryId} onChange={set('categoryId')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2 bg-white">
          <option value="">Select a category…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input required placeholder="Image URLs, comma-separated" value={form.images} onChange={set('images')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
        <input placeholder="Tags, comma-separated" value={form.tags} onChange={set('tags')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={set('isNew')} /> New Arrival</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isBestSeller} onChange={set('isBestSeller')} /> Best Seller</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isSale} onChange={set('isSale')} /> On Sale</label>
      </div>

      {error && <p role="alert" className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary">{error}</p>}

      <button type="submit" disabled={saving} className="btn-dark py-3 px-6 text-xs disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  );
}
