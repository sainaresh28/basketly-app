import { withErrorHandling, ok } from '@/lib/errors/handler';
import { NotFoundError } from '@/lib/errors/app-error';
import { ProductService } from '@/lib/services/product.service';

export const GET = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ idOrSlug: string }> }) => {
  const { idOrSlug } = await ctx.params;

  const product = await ProductService.getBySlug(idOrSlug).catch(async (err) => {
    if (err instanceof NotFoundError) return ProductService.getById(idOrSlug);
    throw err;
  });

  const related = await ProductService.getRelated(product, 6);
  return ok({ product, related });
});
