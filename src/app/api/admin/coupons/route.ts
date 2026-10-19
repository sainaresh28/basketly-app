import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { adminCouponSchema } from '@/lib/validation/schemas';
import { CouponService } from '@/lib/services/coupon.service';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const coupons = await CouponService.listAll();
  return ok({ coupons });
});

export const POST = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const body = await req.json();
  const input = adminCouponSchema.parse(body);
  const coupon = await CouponService.create(input);
  return ok({ coupon }, 201);
});
