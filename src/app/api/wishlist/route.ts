import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { addToWishlistSchema } from '@/lib/validation/schemas';
import { WishlistService } from '@/lib/services/wishlist.service';

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const items = await WishlistService.getWishlist(session.userId);
  return ok({ items });
});

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const { productId } = addToWishlistSchema.parse(body);
  const items = await WishlistService.addItem(session.userId, productId);
  return ok({ items }, 201);
});
