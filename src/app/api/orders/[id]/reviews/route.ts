import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';
import { ReviewService } from '@/lib/services/review.service';

export const GET = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const order = await OrderService.getById(session.userId, id);
  const reviews = await ReviewService.listForOrder(id, order.items.map((i) => i.productId));
  return ok({ reviews });
});
