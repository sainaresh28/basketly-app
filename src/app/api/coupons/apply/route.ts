import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { applyCouponSchema } from '@/lib/validation/schemas';
import { CouponService } from '@/lib/services/coupon.service';

/**
 * Read-only coupon check used by the checkout page before payment — shows
 * the user the discount without consuming the coupon's usage count. The
 * real, atomic redemption happens server-side once payment is confirmed
 * (see OrderService.confirmPayment / placeCodOrder).
 */
export const POST = withErrorHandling(async (req: Request) => {
  await requireSession();
  const body = await req.json();
  const { code, subtotal } = applyCouponSchema.parse(body);

  const { coupon, discount } = await CouponService.preview(code, subtotal);
  return ok({
    code: coupon.code,
    discount,
    description: coupon.description,
  });
});
