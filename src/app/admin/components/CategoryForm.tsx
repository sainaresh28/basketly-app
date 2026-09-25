'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/format';
import type { Category } from '@/types';

type FormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
};

function toFormState(c?: Category): FormState {
  return {
    name: c?.name ?? '',
    slug: c?.slug ?? '',
    description: c?.description ?? '',
    image: c?.image ?? '',
    featured: !!c?.featured,
  };
}

export default function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const isEdit = !!category;
  const [form, setForm] = useState<FormState>(toFormState(category));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: form.name,
      slug: form.slug.trim() || slugify(form.name),
      description: form.description,
      image: form.image.trim(),
      featured: form.featured,
    };

    setSaving(true);
    const res = await fetch(isEdit ? `/api/admin/categories/${category!.id}` : '/api/admin/categories', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);

    if (!res.ok || !json.success) {
      setError(json?.error?.message || 'Could not save category');
      return;
    }
    router.push('/admin/categories');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Category name" value={form.name} onChange={set('name')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
        <input placeholder="URL slug (auto-generated if left blank)" value={form.slug} onChange={set('slug')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
        <textarea placeholder="Description" value={form.description} onChange={set('description')} rows={3}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
        <input required placeholder="Image URL" value={form.image} onChange={set('image')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured on homepage
      </label>

      {error && <p role="alert" className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary">{error}</p>}

      <button type="submit" disabled={saving} className="btn-dark py-3 px-6 text-xs disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Category'}
      </button>
    </form>
  );
}
