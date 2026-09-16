import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { codOrderSchema } from '@/lib/validation/schemas';
import { OrderService } from '@/lib/services/order.service';

/** Places an order paid for on delivery — no Razorpay round-trip needed. */
export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const { shippingAddress } = codOrderSchema.parse(body);

  const order = await OrderService.placeCodOrder(session.userId, shippingAddress);
  return ok({ order }, 201);
});
