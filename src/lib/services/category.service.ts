import { CategoryRepository } from '@/lib/repositories/category.repository';
import { NotFoundError } from '@/lib/errors/app-error';
import type { Category } from '@/types';

export const CategoryService = {
  async listAll(): Promise<Category[]> {
    return CategoryRepository.findAll();
  },

  async listFeatured(): Promise<Category[]> {
    const all = await CategoryRepository.findAll();
    return all.filter((c) => c.featured);
  },

  async getBySlug(slug: string): Promise<Category> {
    const category = await CategoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError(`Category "${slug}" was not found`);
    return category;
  },
};
