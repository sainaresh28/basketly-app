import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { z } from 'zod';
import { CouponService } from '@/lib/services/coupon.service';

const setActiveSchema = z.object({ active: z.boolean() });

/** Admin toggles a coupon active/inactive rather than deleting it, so usage history is kept. */
export const PATCH = withErrorHandling(async (req: Request, ctx: { params: Promise<{ code: string }> }) => {
  await requireAdmin();
  const { code } = await ctx.params;
  const body = await req.json();
  const { active } = setActiveSchema.parse(body);
  const coupon = await CouponService.setActive(code, active);
  return ok({ coupon });
});
