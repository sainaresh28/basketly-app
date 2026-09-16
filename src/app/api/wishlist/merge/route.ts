import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { mergeWishlistSchema } from '@/lib/validation/schemas';
import { WishlistService } from '@/lib/services/wishlist.service';

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = mergeWishlistSchema.parse(body);
  const items = await WishlistService.mergeGuestWishlist(session.userId, input);
  return ok({ items });
});
