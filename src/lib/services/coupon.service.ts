import { CouponRepository, ConditionalCheckFailedException } from '@/lib/repositories/coupon.repository';
import { ValidationError, NotFoundError } from '@/lib/errors/app-error';
import type { Coupon } from '@/types';

export type CouponEvaluation = {
  coupon: Coupon;
  discount: number;
};

/**
 * Pure evaluation: does this coupon apply to this subtotal, and if so for
 * how much? Shared by preview() and redeem() so the discount math can never
 * drift between "what we showed at checkout" and "what we actually applied".
 */
function evaluate(coupon: Coupon, subtotal: number): CouponEvaluation {
  if (!coupon.active) {
    throw new ValidationError('This coupon is no longer active');
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    throw new ValidationError('This coupon has expired');
  }
  if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
    throw new ValidationError('This coupon has reached its usage limit');
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw new ValidationError(`This coupon requires a minimum order of ₹${coupon.minOrderValue.toLocaleString('en-IN')}`);
  }

  let discount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount !== undefined) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);

  return { coupon, discount };
}

export const CouponService = {
  /**
   * Read-only check used while the user is still at checkout, before any
   * payment is captured. Does NOT consume a use of the coupon — so an
   * abandoned checkout never wastes a limited-use code.
   */
  async preview(code: string, subtotal: number): Promise<CouponEvaluation> {
    const coupon = await CouponRepository.findByCode(code);
    if (!coupon) throw new NotFoundError('Invalid coupon code');
    return evaluate(coupon, subtotal);
  },

  /**
   * Called only once a payment is actually confirmed (or for COD, once the
   * order is placed). Atomically increments usedCount with an optimistic
   * lock; on a rare concurrent-redemption race it re-reads the coupon and
   * retries once before giving up.
   */
  async redeem(code: string, subtotal: number): Promise<CouponEvaluation> {
    for (let attempt = 0; attempt < 2; attempt++) {
      const coupon = await CouponRepository.findByCode(code);
      if (!coupon) throw new NotFoundError('Invalid coupon code');
      const result = evaluate(coupon, subtotal);
      try {
        await CouponRepository.incrementUsage(coupon.code, coupon.usedCount);
        return result;
      } catch (err) {
        if (err instanceof ConditionalCheckFailedException && attempt === 0) continue;
        throw err;
      }
    }
    throw new ValidationError('Could not redeem coupon — please try again');
  },

  async create(input: Omit<Coupon, 'usedCount' | 'createdAt'>): Promise<Coupon> {
    const existing = await CouponRepository.findByCode(input.code);
    if (existing) throw new ValidationError('A coupon with this code already exists');
    const coupon: Coupon = {
      ...input,
      code: input.code.toUpperCase(),
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    return CouponRepository.put(coupon);
  },

  async setActive(code: string, active: boolean): Promise<Coupon> {
    const coupon = await CouponRepository.findByCode(code);
    if (!coupon) throw new NotFoundError('Coupon not found');
    return CouponRepository.put({ ...coupon, active });
  },

  async listAll(): Promise<Coupon[]> {
    return CouponRepository.findAll();
  },
};
