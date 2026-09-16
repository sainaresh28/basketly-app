import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';

/** Admin manually (re)issues a refund — e.g. retry after a failed automatic refund, or a return/exchange. */
export const POST = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;

  const order = await OrderService.adminRefund(id);
  return ok({ order });
});
