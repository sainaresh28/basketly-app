import Razorpay from 'razorpay';
import crypto from 'crypto';
import { AppError } from '@/lib/errors/app-error';

function getClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new AppError(
      'Payments are not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      500,
      'PAYMENTS_NOT_CONFIGURED'
    );
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/** Creates a Razorpay order for the given amount (in rupees). Razorpay expects paise. */
export async function createRazorpayOrder(amountInRupees: number, receipt: string) {
  const client = getClient();
  return client.orders.create({
    amount: Math.round(amountInRupees * 100),
    currency: 'INR',
    receipt,
  });
}

/**
 * Verifies the signature Razorpay's checkout returns after a successful
 * payment, proving the payment really happened and wasn't forged client-side.
 * See: https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/#3-verify-payment-signature
 */
export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return expected === signature;
}

/**
 * Issues a refund for a previously captured payment (used when a paid order
 * is cancelled). Amount is optional — omit it for a full refund.
 */
export async function createRazorpayRefund(paymentId: string, amountInRupees?: number) {
  const client = getClient();
  return client.payments.refund(paymentId, amountInRupees ? { amount: Math.round(amountInRupees * 100) } : {});
}
