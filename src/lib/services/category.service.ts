import { v4 as uuidv4 } from 'uuid';
import { CategoryRepository } from '@/lib/repositories/category.repository';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { ConflictError, NotFoundError } from '@/lib/errors/app-error';
import type { AdminCategoryInput, AdminCategoryUpdateInput } from '@/lib/validation/schemas';
import type { Category } from '@/types';

export const CategoryService = {
  async listAll(): Promise<Category[]> {
    return CategoryRepository.findAll();
  },

  async listFeatured(): Promise<Category[]> {
    const all = await CategoryRepository.findAll();
    return all.filter((c) => c.featured);
  },

  async getById(id: string): Promise<Category> {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  },

  async getBySlug(slug: string): Promise<Category> {
    const category = await CategoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError(`Category "${slug}" was not found`);
    return category;
  },

  async create(input: AdminCategoryInput): Promise<Category> {
    const existing = await CategoryRepository.findBySlug(input.slug);
    if (existing) throw new ConflictError('A category with that slug already exists');

    const category: Category = { id: uuidv4(), productCount: 0, ...input };
    return CategoryRepository.put(category);
  },

  async update(id: string, patch: AdminCategoryUpdateInput): Promise<Category> {
    const existing = await CategoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category not found');

    if (patch.slug && patch.slug !== existing.slug) {
      const bySlug = await CategoryRepository.findBySlug(patch.slug);
      if (bySlug && bySlug.id !== id) throw new ConflictError('A category with that slug already exists');
    }

    return CategoryRepository.update(id, patch);
  },

  async delete(id: string): Promise<void> {
    const existing = await CategoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category not found');

    // Guard against orphaning products: refuse to delete a category that
    // still has products assigned to it.
    const productsInCategory = await ProductRepository.findByCategory(id);
    if (productsInCategory.length > 0) {
      throw new ConflictError(
        `Can't delete "${existing.name}" — ${productsInCategory.length} product(s) still use this category. Reassign or delete them first.`
      );
    }

    await CategoryRepository.delete(id);
  },
};
