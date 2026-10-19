import { describe, it, expect } from 'vitest';
import { getVariantOptions, resolveVariant } from './variants';
import type { Product, ProductVariant } from '@/types';

function makeVariant(options: Record<string, string>, available: number): ProductVariant {
  return {
    id: `v-${Object.values(options).join('-')}`,
    sku: `sku-${Object.values(options).join('-')}`,
    options,
    inventory: {
      quantity: available,
      reserved: 0,
      available,
      lowStockThreshold: 2,
      status: available === 0 ? 'out_of_stock' : available <= 2 ? 'low_stock' : 'in_stock',
    },
  };
}

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-001',
    name: 'Test Product',
    slug: 'test-product',
    description: 'A product',
    price: 999,
    categoryId: 'cat-3',
    categoryName: 'Electronics',
    images: ['img.jpg'],
    rating: 4,
    reviewCount: 10,
    stock: 20,
    brand: 'TestBrand',
    tags: [],
    ...overrides,
  } as Product;
}

describe('getVariantOptions', () => {
  it('extracts real dimensions from persisted variants, with isColor flagged', () => {
    const product = makeProduct({
      variants: [
        makeVariant({ color: 'Black', connectivity: 'Bluetooth' }, 5),
        makeVariant({ color: 'Red', connectivity: 'Wired' }, 3),
      ],
    });
    const { dimensions } = getVariantOptions(product);
    const colorDim = dimensions.find((d) => d.key === 'color');
    const connDim = dimensions.find((d) => d.key === 'connectivity');
    expect(colorDim?.isColor).toBe(true);
    expect(colorDim?.values.sort()).toEqual(['Black', 'Red']);
    expect(connDim?.isColor).toBe(false);
    expect(connDim?.values.sort()).toEqual(['Bluetooth', 'Wired']);
  });

  it('returns no dimensions for a product with no variants and an unrecognized category', () => {
    const product = makeProduct({ variants: undefined, categoryName: 'Electronics' });
    const { dimensions } = getVariantOptions(product);
    expect(dimensions).toEqual([]);
  });
});

describe('resolveVariant', () => {
  const product = makeProduct({
    variants: [
      makeVariant({ color: 'Black', size: 'M' }, 5),
      makeVariant({ color: 'Black', size: 'L' }, 2),
      makeVariant({ color: 'Red', size: 'M' }, 0),
    ],
  });

  it('resolves the exact SKU matching the full set of chosen options', () => {
    const resolved = resolveVariant(product, { color: 'Black', size: 'L' });
    expect(resolved?.inventory.available).toBe(2);
  });

  it('reflects the specific SKU stock, not the product-level total stock', () => {
    const resolved = resolveVariant(product, { color: 'Red', size: 'M' });
    expect(resolved?.inventory.available).toBe(0);
    expect(resolved?.inventory.available).not.toBe(product.stock);
  });

  it('returns undefined when no variant matches the selection', () => {
    const resolved = resolveVariant(product, { color: 'Blue', size: 'M' });
    expect(resolved).toBeUndefined();
  });

  it('returns undefined when the product has no variants at all', () => {
    const noVariants = makeProduct({ variants: undefined });
    expect(resolveVariant(noVariants, { color: 'Black' })).toBeUndefined();
  });
});
