'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Product, ProductVariant } from '@/types';
import { getAttributeSchema, getSubcategories } from '@/lib/catalog/taxonomy';

type VariantRow = { id: string; color: string; size: string; quantity: string };

type FormState = {
  name: string; slug: string; description: string; price: string; originalPrice: string;
  categoryId: string; subcategoryId: string; images: string; stock: string; brand: string; tags: string;
  isNew: boolean; isBestSeller: boolean; isSale: boolean;
  attributes: Record<string, string>;
  variants: VariantRow[];
};

function variantRowsFrom(product?: Product): VariantRow[] {
  if (!product?.variants?.length) return [];
  return product.variants.map((v) => ({
    id: v.id,
    color: v.options.color || '',
    size: v.options.size || '',
    quantity: String(v.inventory.quantity),
  }));
}

function toFormState(p?: Product): FormState {
  return {
    name: p?.name ?? '', slug: p?.slug ?? '', description: p?.description ?? '',
    price: p ? String(p.price) : '', originalPrice: p?.originalPrice ? String(p.originalPrice) : '',
    categoryId: p?.categoryId ?? '', subcategoryId: p?.subcategoryId ?? '',
    images: p?.images?.join(', ') ?? '',
    stock: p ? String(p.stock) : '0', brand: p?.brand ?? '',
    tags: p?.tags?.join(', ') ?? '',
    isNew: !!p?.isNew, isBestSeller: !!p?.isBestSeller, isSale: !!p?.isSale,
    attributes: Object.fromEntries(Object.entries(p?.attributes ?? {}).map(([k, v]) => [k, String(v)])),
    variants: variantRowsFrom(p),
  };
}

function buildVariants(productId: string, rows: VariantRow[]): ProductVariant[] {
  return rows
    .filter((r) => r.color || r.size)
    .map((r) => {
      const quantity = Math.max(0, Number(r.quantity) || 0);
      const skuParts = [productId, r.color, r.size].filter(Boolean);
      return {
        id: r.id,
        sku: skuParts.join('-').toUpperCase().replace(/\s+/g, ''),
        options: { ...(r.color ? { color: r.color } : {}), ...(r.size ? { size: r.size } : {}) },
        inventory: {
          quantity,
          reserved: 0,
          available: quantity,
          lowStockThreshold: 5,
          status: quantity === 0 ? 'out_of_stock' : quantity <= 5 ? 'low_stock' : 'in_stock',
        },
      };
    });
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

  const topCategories = useMemo(() => categories.filter((c) => c.level === 0), [categories]);
  const subcategories = useMemo(() => (form.categoryId ? getSubcategories(form.categoryId) : []), [form.categoryId]);
  const attributeSchema = useMemo(() => (form.categoryId ? getAttributeSchema(form.categoryId) : []), [form.categoryId]);
  const hasVariants = form.variants.length > 0;
  const variantStockTotal = form.variants.reduce((s, r) => s + (Number(r.quantity) || 0), 0);

  const set = <K extends keyof FormState>(key: K) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setAttribute = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, attributes: { ...prev.attributes, [key]: value } }));
  };

  const addVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { id: `var-${Date.now()}`, color: '', size: '', quantity: '0' }],
    }));
  };

  const updateVariantRow = (id: string, patch: Partial<VariantRow>) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  };

  const removeVariantRow = (id: string) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((r) => r.id !== id) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const category = categories.find((c) => c.id === form.categoryId);
    if (!category) {
      setError('Please choose a category');
      return;
    }
    const subcategory = subcategories.find((s) => s.id === form.subcategoryId);

    const slug = form.slug || form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const variants = buildVariants(product?.id || slug, form.variants);

    const attributes: Record<string, string | number | boolean> = {};
    for (const def of attributeSchema) {
      const raw = form.attributes[def.key];
      if (raw === undefined || raw === '') continue;
      attributes[def.key] = def.type === 'boolean' ? raw === 'true' : raw;
    }

    const payload = {
      name: form.name,
      slug,
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      categoryId: category.id,
      categoryName: category.name,
      subcategoryId: subcategory?.id,
      subcategoryName: subcategory?.name,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      stock: hasVariants ? variantStockTotal : Number(form.stock),
      brand: form.brand,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      isSale: form.isSale,
      attributes: Object.keys(attributes).length ? attributes : undefined,
      variants: variants.length ? variants : undefined,
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
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2 bg-background text-foreground" />
        <input placeholder="URL slug (auto-generated if left blank)" value={form.slug} onChange={set('slug')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2 bg-background text-foreground" />
        <textarea required placeholder="Description" value={form.description} onChange={set('description')} rows={4}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2 bg-background text-foreground" />
        <input required type="number" min={0} step="0.01" placeholder="Price" value={form.price} onChange={set('price')}
          className="rounded-xl border border-border px-4 py-3 text-sm bg-background text-foreground" />
        <input type="number" min={0} step="0.01" placeholder="Original price (optional, for sale badge)" value={form.originalPrice} onChange={set('originalPrice')}
          className="rounded-xl border border-border px-4 py-3 text-sm bg-background text-foreground" />
        <input required type="number" min={0} placeholder="Stock quantity" value={form.stock} onChange={set('stock')}
          disabled={hasVariants}
          className="rounded-xl border border-border px-4 py-3 text-sm bg-background text-foreground disabled:opacity-50" />
        <input required placeholder="Brand" value={form.brand} onChange={set('brand')}
          className="rounded-xl border border-border px-4 py-3 text-sm bg-background text-foreground" />
        <select required value={form.categoryId} onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value, subcategoryId: '', attributes: {} }))}
          className="rounded-xl border border-border px-4 py-3 text-sm bg-background text-foreground">
          <option value="">Select a category…</option>
          {topCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.subcategoryId} onChange={set('subcategoryId')} disabled={!subcategories.length}
          className="rounded-xl border border-border px-4 py-3 text-sm bg-background text-foreground disabled:opacity-50">
          <option value="">Subcategory (optional)…</option>
          {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input required placeholder="Image URLs, comma-separated" value={form.images} onChange={set('images')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2 bg-background text-foreground" />
        <input placeholder="Tags, comma-separated" value={form.tags} onChange={set('tags')}
          className="rounded-xl border border-border px-4 py-3 text-sm sm:col-span-2 bg-background text-foreground" />
      </div>

      {/* Dynamic attributes for the selected category */}
      {attributeSchema.length > 0 && (
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">Category Attributes</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {attributeSchema.map((def) => (
              <label key={def.key} className="text-xs font-semibold text-muted-foreground">
                {def.label}
                {def.type === 'boolean' ? (
                  <select value={form.attributes[def.key] ?? ''} onChange={(e) => setAttribute(def.key, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground">
                    <option value="">—</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : def.options ? (
                  <select value={form.attributes[def.key] ?? ''} onChange={(e) => setAttribute(def.key, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground">
                    <option value="">—</option>
                    {def.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input value={form.attributes[def.key] ?? ''} onChange={(e) => setAttribute(def.key, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Real variants — each row becomes its own SKU with its own tracked inventory */}
      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">
            Variants {hasVariants && <span className="text-muted-foreground font-medium normal-case">— total stock: {variantStockTotal}</span>}
          </p>
          <button type="button" onClick={addVariantRow} className="text-xs font-bold text-primary hover:underline">+ Add Variant</button>
        </div>
        {form.variants.length === 0 ? (
          <p className="text-xs text-muted-foreground">No variants — this product sells as a single SKU using the stock quantity above.</p>
        ) : (
          <div className="space-y-2">
            {form.variants.map((row) => (
              <div key={row.id} className="grid grid-cols-[1fr_1fr_5rem_auto] gap-2 items-center">
                <input placeholder="Color (optional)" value={row.color} onChange={(e) => updateVariantRow(row.id, { color: e.target.value })}
                  className="rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground" />
                <input placeholder="Size (optional)" value={row.size} onChange={(e) => updateVariantRow(row.id, { size: e.target.value })}
                  className="rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground" />
                <input type="number" min={0} placeholder="Qty" value={row.quantity} onChange={(e) => updateVariantRow(row.id, { quantity: e.target.value })}
                  className="rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground" />
                <button type="button" onClick={() => removeVariantRow(row.id)} className="text-muted-foreground hover:text-primary transition-colors px-1" aria-label="Remove variant">✕</button>
              </div>
            ))}
          </div>
        )}
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
