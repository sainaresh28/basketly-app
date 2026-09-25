import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { adminCategoryUpdateSchema } from '@/lib/validation/schemas';
import { CategoryService } from '@/lib/services/category.service';

export const GET = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const category = await CategoryService.getById(id);
  return ok({ category });
});

export const PUT = withErrorHandling(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json();
  const patch = adminCategoryUpdateSchema.parse(body);
  const category = await CategoryService.update(id, patch);
  return ok({ category });
});

export const DELETE = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await CategoryService.delete(id);
  return ok({ deleted: true });
});
