import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { WishlistService } from '@/lib/services/wishlist.service';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const items = await WishlistService.listAllForAdmin();
  return ok({ items });
});
