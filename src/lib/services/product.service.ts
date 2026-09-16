import { ProductRepository } from '@/lib/repositories/product.repository';
import { NotFoundError } from '@/lib/errors/app-error';
import type { ProductQuery } from '@/lib/validation/schemas';
import type { Product } from '@/types';

/**
 * Applies search/filter/sort business rules in memory. The catalog is small
 * enough (tens–low hundreds of SKUs) that Scan + in-memory filter is a
 * reasonable, honest trade-off for this project; a larger catalog would
 * push filtering to a search index instead (see product.repository.ts).
 */
function applyQuery(products: Product[], query: ProductQuery): Product[] {
  let result = [...products];

  if (query.category) {
    result = result.filter((p) => p.categoryId === query.category);
  }

  if (query.q) {
    const q = query.q.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (query.brands) {
    const brands = query.brands.split(',').map((b) => b.trim().toLowerCase()).filter(Boolean);
    if (brands.length) result = result.filter((p) => brands.includes(p.brand.toLowerCase()));
  }

  if (query.priceMin !== undefined) result = result.filter((p) => p.price >= query.priceMin!);
  if (query.priceMax !== undefined) result = result.filter((p) => p.price <= query.priceMax!);
  if (query.rating) result = result.filter((p) => p.rating >= query.rating!);

  if (query.availability === 'inStock') result = result.filter((p) => p.stock > 0);
  if (query.availability === 'outOfStock') result = result.filter((p) => p.stock === 0);

  switch (query.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case 'popular':
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'featured':
    default:
      result.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
  }

  if (query.limit) result = result.slice(0, query.limit);
  return result;
}

export const ProductService = {
  async list(query: ProductQuery = {}): Promise<Product[]> {
    const all = await ProductRepository.findAll();
    return applyQuery(all, query);
  },

  async getById(id: string): Promise<Product> {
    const product = await ProductRepository.findById(id);
    if (!product) throw new NotFoundError(`Product "${id}" was not found`);
    return product;
  },

  async getBySlug(slug: string): Promise<Product> {
    const product = await ProductRepository.findBySlug(slug);
    if (!product) throw new NotFoundError(`Product "${slug}" was not found`);
    return product;
  },

  async getManyByIds(ids: string[]): Promise<Product[]> {
    return ProductRepository.findManyByIds(ids);
  },

  async getTrending(limit = 8): Promise<Product[]> {
    const all = await ProductRepository.findAll();
    return all
      .filter((p) => p.isBestSeller)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const all = await ProductRepository.findAll();
    return all.filter((p) => p.isNew).slice(0, limit);
  },

  async getOnSale(limit = 12): Promise<Product[]> {
    const all = await ProductRepository.findAll();
    return all.filter((p) => p.isSale).slice(0, limit);
  },

  async getRelated(product: Product, limit = 6): Promise<Product[]> {
    const sameCategory = await ProductRepository.findByCategory(product.categoryId);
    return sameCategory.filter((p) => p.id !== product.id).slice(0, limit);
  },

  async getFacets(): Promise<{ brands: string[]; priceMin: number; priceMax: number }> {
    const all = await ProductRepository.findAll();
    const brands = Array.from(new Set(all.map((p) => p.brand))).sort();
    const prices = all.map((p) => p.price);
    return {
      brands,
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 0,
    };
  },
};
