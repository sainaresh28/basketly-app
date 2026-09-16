import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { adminProductUpdateSchema } from '@/lib/validation/schemas';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { NotFoundError } from '@/lib/errors/app-error';

export const PUT = withErrorHandling(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json();
  const patch = adminProductUpdateSchema.parse(body);

  const existing = await ProductRepository.findById(id);
  if (!existing) throw new NotFoundError('Product not found');

  const product = await ProductRepository.update(id, patch);
  return ok({ product });
});

export const DELETE = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await ProductRepository.delete(id);
  return ok({ deleted: true });
});
