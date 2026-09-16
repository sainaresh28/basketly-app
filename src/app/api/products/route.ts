import { withErrorHandling, ok } from '@/lib/errors/handler';
import { productQuerySchema } from '@/lib/validation/schemas';
import { ProductService } from '@/lib/services/product.service';

export const GET = withErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = productQuerySchema.parse(Object.fromEntries(searchParams.entries()));

  const products = await ProductService.list(query);
  return ok({ products, total: products.length });
});
