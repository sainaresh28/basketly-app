import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const orders = await OrderService.getForUser(session.userId);
  return ok({ orders });
});
