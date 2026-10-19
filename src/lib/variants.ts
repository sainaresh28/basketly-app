import type { Product, ProductVariant } from '@/types';
import { COLOR_HEX } from '@/lib/catalog/enrich';
import { getAttributeSchema } from '@/lib/catalog/taxonomy';

export interface VariantDimension {
  key: string;
  label: string;
  /** True for the "color" dimension specifically — renders as swatches instead of pill buttons. */
  isColor: boolean;
  values: string[];
}

export interface VariantOptions {
  dimensions: VariantDimension[];
}

const FALLBACK_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) { h = (h << 5) - h + input.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, count: number): T[] {
  const start = seed % arr.length;
  const out: T[] = [];
  for (let i = 0; i < count; i++) out.push(arr[(start + i) % arr.length]);
  return out;
}

function labelFor(product: Product, key: string): string {
  const def = getAttributeSchema(product.categoryId).find((a) => a.key === key);
  if (def) return def.label;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * The picker's source of truth: real, purchasable SKUs from the catalog —
 * every dimension the product actually varies by (size, color, connectivity,
 * RAM, capacity, whatever the category calls for), each backed by its own
 * tracked inventory. Falls back to a stable size/color guess only for
 * legacy products that predate the variant model.
 */
export function getVariantOptions(product: Product): VariantOptions {
  if (product.variants && product.variants.length > 0) {
    const keys = Array.from(new Set(product.variants.flatMap((v) => Object.keys(v.options))));
    const dimensions: VariantDimension[] = keys.map((key) => ({
      key,
      label: labelFor(product, key),
      isColor: key === 'color',
      values: Array.from(new Set(product.variants!.map((v) => v.options[key]).filter(Boolean))) as string[],
    }));
    return { dimensions };
  }

  // Fallback for any product without persisted variants.
  const seed = hashString(product.id);
  const category = product.categoryName.toLowerCase();
  const dimensions: VariantDimension[] = [];
  if (category.includes('fashion') || category.includes('cloth')) {
    dimensions.push({ key: 'size', label: 'Size', isColor: false, values: FALLBACK_SIZES });
  } else if (category.includes('foot')) {
    dimensions.push({ key: 'size', label: 'Size', isColor: false, values: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'] });
  }
  return { dimensions };
}

export function colorHex(name: string): string {
  return COLOR_HEX[name] || '#8A8580';
}

/** Finds the real SKU matching a full set of chosen options, so add-to-cart can check its actual inventory rather than the product's overall stock. */
export function resolveVariant(product: Product, selected: Record<string, string | null | undefined>): ProductVariant | undefined {
  if (!product.variants || product.variants.length === 0) return undefined;
  return product.variants.find((v) =>
    Object.entries(v.options).every(([key, value]) => !value || selected[key] === value)
  );
}
