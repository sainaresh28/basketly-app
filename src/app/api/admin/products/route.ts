import { v4 as uuidv4 } from 'uuid';
import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { adminProductSchema } from '@/lib/validation/schemas';
import { ProductService } from '@/lib/services/product.service';
import { ProductRepository } from '@/lib/repositories/product.repository';
import type { Product } from '@/types';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const products = await ProductService.list();
  return ok({ products });
});

export const POST = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const body = await req.json();
  const input = adminProductSchema.parse(body);

  const product: Product = {
    id: uuidv4(),
    rating: 0,
    reviewCount: 0,
    ...input,
  };
  await ProductRepository.put(product);
  return ok({ product }, 201);
});
