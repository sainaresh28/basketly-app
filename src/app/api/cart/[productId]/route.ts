import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { updateCartItemSchema } from '@/lib/validation/schemas';
import { CartService } from '@/lib/services/cart.service';

export const PATCH = withErrorHandling(async (req: Request, ctx: { params: Promise<{ productId: string }> }) => {
  const session = await requireSession();
  const { productId } = await ctx.params;
  const body = await req.json();
  const { quantity } = updateCartItemSchema.parse(body);

  const cart = await CartService.updateQuantity(session.userId, productId, quantity);
  return ok({ cart });
});

export const DELETE = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ productId: string }> }) => {
  const session = await requireSession();
  const { productId } = await ctx.params;
  const cart = await CartService.removeItem(session.userId, productId);
  return ok({ cart });
});
