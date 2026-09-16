import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { mergeCartSchema } from '@/lib/validation/schemas';
import { CartService } from '@/lib/services/cart.service';

/** Called once, right after login, to fold a guest's local cart into their account. */
export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = mergeCartSchema.parse(body);
  const cart = await CartService.mergeGuestCart(session.userId, input);
  return ok({ cart });
});
