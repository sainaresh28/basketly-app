import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { updateCartItemSchema } from '@/lib/validation/schemas';
import { CartService } from '@/lib/services/cart.service';

// The [productId] segment is really a cart line key: a plain product id for
// single-SKU items, or `${productId}::${size}::${color}` when a variant was
// selected — see cartLineKey() in the cart repository.

export const PATCH = withErrorHandling(async (req: Request, ctx: { params: Promise<{ productId: string }> }) => {
  const session = await requireSession();
  const { productId: lineId } = await ctx.params;
  const body = await req.json();
  const { quantity } = updateCartItemSchema.parse(body);

  const cart = await CartService.updateQuantity(session.userId, lineId, quantity);
  return ok({ cart });
});

export const DELETE = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ productId: string }> }) => {
  const session = await requireSession();
  const { productId: lineId } = await ctx.params;
  const cart = await CartService.removeItem(session.userId, lineId);
  return ok({ cart });
});
