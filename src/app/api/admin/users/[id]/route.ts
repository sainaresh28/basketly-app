import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { adminUserUpdateSchema } from '@/lib/validation/schemas';
import { UserService } from '@/lib/services/user.service';

export const GET = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const user = await UserService.getById(id);
  return ok({ user });
});

export const PUT = withErrorHandling(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json();
  const patch = adminUserUpdateSchema.parse(body);
  const user = await UserService.update(id, session.userId, patch);
  return ok({ user });
});

export const DELETE = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  await UserService.delete(id, session.userId);
  return ok({ deleted: true });
});
