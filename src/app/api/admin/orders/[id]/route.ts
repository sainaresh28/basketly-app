import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { updateOrderStatusSchema } from '@/lib/validation/schemas';
import { OrderService } from '@/lib/services/order.service';

export const PATCH = withErrorHandling(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const body = await req.json();
  const { status, trackingNumber, courier, estimatedDelivery } = updateOrderStatusSchema.parse(body);

  await OrderService.updateStatus(id, status, { trackingNumber, courier, estimatedDelivery });
  return ok({ updated: true });
});
