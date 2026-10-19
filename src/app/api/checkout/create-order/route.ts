import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';

/** Step 1: open a Razorpay order for the user's current cart total (optionally discounted by a coupon). */
export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json().catch(() => ({}));
  const couponCode = typeof body?.couponCode === 'string' ? body.couponCode : undefined;

  const { razorpayOrder, cart, discount, couponCode: appliedCode } = await OrderService.startCheckout(
    session.userId,
    couponCode
  );

  return ok({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    cart,
    discount,
    couponCode: appliedCode,
  });
});
