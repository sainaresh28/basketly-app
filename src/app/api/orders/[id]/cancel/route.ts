import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { cancelOrderSchema } from '@/lib/validation/schemas';
import { OrderService } from '@/lib/services/order.service';

export const POST = withErrorHandling(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const { reason } = cancelOrderSchema.parse(body);

  const order = await OrderService.cancelOrder(session.userId, id, reason);
  return ok({ order });
});
