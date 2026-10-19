import { BrandRepository } from '@/lib/repositories/brand.repository';
import { NotFoundError } from '@/lib/errors/app-error';
import type { Brand } from '@/types';

export const BrandService = {
  async listAll(): Promise<Brand[]> {
    return BrandRepository.findAll();
  },

  async getBySlug(slug: string): Promise<Brand> {
    const brand = await BrandRepository.findBySlug(slug);
    if (!brand) throw new NotFoundError('Brand not found');
    return brand;
  },
};
