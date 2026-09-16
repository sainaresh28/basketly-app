import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { WishlistService } from '@/lib/services/wishlist.service';

export const DELETE = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ productId: string }> }) => {
  const session = await requireSession();
  const { productId } = await ctx.params;
  const items = await WishlistService.removeItem(session.userId, productId);
  return ok({ items });
});
