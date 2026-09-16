import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';

/** Step 1: open a Razorpay order for the user's current cart total. */
export const POST = withErrorHandling(async () => {
  const session = await requireSession();
  const { razorpayOrder, cart } = await OrderService.startCheckout(session.userId);

  return ok({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    cart,
  });
});
