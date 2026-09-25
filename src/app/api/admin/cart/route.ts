import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { CartService } from '@/lib/services/cart.service';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const items = await CartService.listAllForAdmin();
  return ok({ items });
});
