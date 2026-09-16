import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { addressUpdateSchema } from '@/lib/validation/schemas';
import { AuthService } from '@/lib/services/auth.service';

export const PATCH = withErrorHandling(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const body = await req.json();
  const input = addressUpdateSchema.parse(body);

  const addresses = await AuthService.updateAddress(session.userId, id, input);
  return ok({ addresses });
});

export const DELETE = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const session = await requireSession();
  const { id } = await ctx.params;

  const addresses = await AuthService.deleteAddress(session.userId, id);
  return ok({ addresses });
});
