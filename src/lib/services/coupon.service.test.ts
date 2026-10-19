import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Coupon } from '@/types';

const findByCode = vi.fn();
const incrementUsage = vi.fn();
const put = vi.fn();
const findAll = vi.fn();

vi.mock('@/lib/repositories/coupon.repository', async () => {
  const actual = await vi.importActual<typeof import('@aws-sdk/client-dynamodb')>('@aws-sdk/client-dynamodb');
  return {
    CouponRepository: { findByCode, incrementUsage, put, findAll },
    ConditionalCheckFailedException: actual.ConditionalCheckFailedException,
  };
});

const { CouponService } = await import('./coupon.service');
const { ConditionalCheckFailedException } = await import('@aws-sdk/client-dynamodb');

function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    code: 'SAVE20',
    type: 'percent',
    value: 20,
    usedCount: 0,
    active: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => {
  findByCode.mockReset();
  incrementUsage.mockReset();
  put.mockReset();
  findAll.mockReset();
});

describe('CouponService.preview', () => {
  it('computes a percent discount off the subtotal', async () => {
    findByCode.mockResolvedValue(makeCoupon({ type: 'percent', value: 20 }));
    const { discount } = await CouponService.preview('SAVE20', 1000);
    expect(discount).toBe(200);
  });

  it('computes a flat discount', async () => {
    findByCode.mockResolvedValue(makeCoupon({ type: 'flat', value: 150 }));
    const { discount } = await CouponService.preview('FLAT150', 1000);
    expect(discount).toBe(150);
  });

  it('caps a percent discount at maxDiscount', async () => {
    findByCode.mockResolvedValue(makeCoupon({ type: 'percent', value: 50, maxDiscount: 100 }));
    const { discount } = await CouponService.preview('HALFOFF', 1000);
    expect(discount).toBe(100);
  });

  it('never discounts more than the subtotal itself', async () => {
    findByCode.mockResolvedValue(makeCoupon({ type: 'flat', value: 5000 }));
    const { discount } = await CouponService.preview('HUGE', 1000);
    expect(discount).toBe(1000);
  });

  it('rejects an inactive coupon', async () => {
    findByCode.mockResolvedValue(makeCoupon({ active: false }));
    await expect(CouponService.preview('SAVE20', 1000)).rejects.toThrow(/no longer active/);
  });

  it('rejects an expired coupon', async () => {
    findByCode.mockResolvedValue(makeCoupon({ expiresAt: new Date(Date.now() - 1000).toISOString() }));
    await expect(CouponService.preview('SAVE20', 1000)).rejects.toThrow(/expired/);
  });

  it('rejects a coupon that has hit its usage limit', async () => {
    findByCode.mockResolvedValue(makeCoupon({ usageLimit: 5, usedCount: 5 }));
    await expect(CouponService.preview('SAVE20', 1000)).rejects.toThrow(/usage limit/);
  });

  it('rejects when the subtotal is below minOrderValue', async () => {
    findByCode.mockResolvedValue(makeCoupon({ minOrderValue: 2000 }));
    await expect(CouponService.preview('SAVE20', 1000)).rejects.toThrow(/minimum order/);
  });

  it('throws NotFoundError for an unknown code', async () => {
    findByCode.mockResolvedValue(null);
    await expect(CouponService.preview('NOPE', 1000)).rejects.toThrow();
  });

  it('never increments usage during a preview', async () => {
    findByCode.mockResolvedValue(makeCoupon());
    await CouponService.preview('SAVE20', 1000);
    expect(incrementUsage).not.toHaveBeenCalled();
  });
});

describe('CouponService.redeem', () => {
  it('atomically increments usage on success', async () => {
    findByCode.mockResolvedValue(makeCoupon({ usedCount: 3 }));
    incrementUsage.mockResolvedValue(undefined);
    const { discount } = await CouponService.redeem('SAVE20', 1000);
    expect(discount).toBe(200);
    expect(incrementUsage).toHaveBeenCalledWith('SAVE20', 3);
  });

  it('retries once against a freshly-read coupon on a concurrent-redemption race', async () => {
    findByCode
      .mockResolvedValueOnce(makeCoupon({ usedCount: 3 }))
      .mockResolvedValueOnce(makeCoupon({ usedCount: 4 }));
    incrementUsage
      .mockRejectedValueOnce(new ConditionalCheckFailedException({ message: 'stale', $metadata: {} }))
      .mockResolvedValueOnce(undefined);

    const { discount } = await CouponService.redeem('SAVE20', 1000);
    expect(discount).toBe(200);
    expect(incrementUsage).toHaveBeenCalledTimes(2);
    expect(incrementUsage).toHaveBeenNthCalledWith(2, 'SAVE20', 4);
  });
});
