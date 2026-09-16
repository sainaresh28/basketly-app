import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { verifyPaymentSchema, shippingAddressSchema } from '@/lib/validation/schemas';
import { OrderService } from '@/lib/services/order.service';
import { z } from 'zod';

const bodySchema = verifyPaymentSchema.extend({ shippingAddress: shippingAddressSchema });

/** Step 2: verify the payment Razorpay's widget reported, then create the order. */
export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = bodySchema.parse(body) as z.infer<typeof bodySchema>;

  const order = await OrderService.confirmPayment(session.userId, input);
  return ok({ order }, 201);
});
