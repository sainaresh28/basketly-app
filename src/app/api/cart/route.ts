import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { addToCartSchema } from '@/lib/validation/schemas';
import { CartService } from '@/lib/services/cart.service';

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const cart = await CartService.getCart(session.userId);
  return ok({ cart });
});

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = addToCartSchema.parse(body);
  const cart = await CartService.addItem(session.userId, input);
  return ok({ cart }, 201);
});

export const DELETE = withErrorHandling(async () => {
  const session = await requireSession();
  const cart = await CartService.clear(session.userId);
  return ok({ cart });
});
