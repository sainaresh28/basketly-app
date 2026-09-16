import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const orders = await OrderService.listAll();
  return ok({ orders });
});
