import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { adminCategorySchema } from '@/lib/validation/schemas';
import { CategoryService } from '@/lib/services/category.service';
import { ProductService } from '@/lib/services/product.service';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const [categories, products] = await Promise.all([CategoryService.listAll(), ProductService.list()]);

  // The stored productCount can drift from reality as products are added,
  // recategorized or deleted, so the admin view always shows a live count.
  const liveCounts = new Map<string, number>();
  for (const p of products) liveCounts.set(p.categoryId, (liveCounts.get(p.categoryId) ?? 0) + 1);

  return ok({
    categories: categories.map((c) => ({ ...c, productCount: liveCounts.get(c.id) ?? 0 })),
  });
});

export const POST = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const body = await req.json();
  const input = adminCategorySchema.parse(body);
  const category = await CategoryService.create(input);
  return ok({ category }, 201);
});
