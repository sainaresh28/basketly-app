import { BRAND } from '@/lib/brand';
import { formatSelectedOptions, formatPrice } from '@/utils/format';
import type { Order } from '@/types';

/**
 * Transactional email sending, via Brevo's HTTP API (https://api.brevo.com).
 *
 * Brevo (formerly Sendinblue) is used here because its free tier — 300
 * emails/day, forever — only requires verifying a *sender email address*,
 * not a domain. That makes it a good fit for a project with no domain yet:
 * you sign up, verify the address you send from (e.g. your Gmail), grab an
 * API key, and it works identically on localhost and after deployment.
 * When you eventually buy a domain you can verify it in Brevo instead for
 * better deliverability — no code changes needed.
 *
 * Using their HTTP API (rather than SMTP) also sidesteps the outbound
 * SMTP-port restrictions some serverless hosts (Netlify, Vercel, etc.)
 * impose — a plain HTTPS fetch always works.
 *
 * If BREVO_API_KEY isn't set, sendPasswordResetEmail() resolves to
 * { sent: false } instead of throwing, so local dev without any email
 * provider configured keeps working via the existing dev-preview fallback.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

export type SendResult = { sent: true } | { sent: false; reason: string };

function isEmailConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}

function resetPasswordEmailHtml(resetUrl: string): string {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #18181b;">
    <p style="font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a; margin: 0 0 16px;">${BRAND.name}</p>
    <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 16px;">Reset your password</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 24px;">
      We got a request to reset the password on your ${BRAND.name} account. This link expires in 30 minutes.
      If you didn't ask for this, you can safely ignore this email.
    </p>
    <a href="${resetUrl}"
       style="display: inline-block; background: #18181b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 14px 24px; border-radius: 8px;">
      Set a new password
    </a>
    <p style="font-size: 12px; line-height: 1.6; color: #a1a1aa; margin: 24px 0 0; word-break: break-all;">
      Or paste this link into your browser:<br />${resetUrl}
    </p>
  </div>`.trim();
}

function resetPasswordEmailText(resetUrl: string): string {
  return `Reset your ${BRAND.name} password\n\nWe got a request to reset the password on your ${BRAND.name} account. This link expires in 30 minutes. If you didn't ask for this, ignore this email.\n\n${resetUrl}`;
}

/** Shared Brevo HTTP-API send, used by every email template below. Never throws. */
async function sendViaBrevo(opts: {
  toEmail: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  if (!isEmailConfigured()) {
    return { sent: false, reason: 'not_configured' };
  }

  const fromEmail = process.env.EMAIL_FROM_ADDRESS;
  const fromName = process.env.EMAIL_FROM_NAME || BRAND.name;

  if (!fromEmail) {
    console.error('[email] BREVO_API_KEY is set but EMAIL_FROM_ADDRESS is missing.');
    return { sent: false, reason: 'missing_from_address' };
  }

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: opts.toEmail }],
        subject: opts.subject,
        htmlContent: opts.html,
        textContent: opts.text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[email] Brevo send failed (${res.status}): ${body}`);
      return { sent: false, reason: 'provider_error' };
    }

    return { sent: true };
  } catch (err) {
    console.error('[email] Brevo request threw:', err);
    return { sent: false, reason: 'network_error' };
  }
}

function orderConfirmationHtml(order: Order, orderUrl: string): string {
  const rows = order.items
    .map((item) => {
      const opts = formatSelectedOptions(item.selectedOptions);
      return `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #18181b;">
          ${item.name}${opts ? `<br/><span style="color:#71717a; font-size: 12px;">${opts}</span>` : ''}<br/>
          <span style="color:#a1a1aa; font-size: 12px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #18181b; text-align: right; white-space: nowrap;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`;
    })
    .join('');

  const addr = order.shippingAddress;

  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #18181b;">
    <p style="font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a; margin: 0 0 16px;">${BRAND.name}</p>
    <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 8px;">Order confirmed</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 20px;">
      Thanks for your order! We'll email you again once it ships. Order ID: <strong>${order.id}</strong>
    </p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      ${rows}
    </table>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #3f3f46;">
      <tr><td style="padding: 4px 0;">Subtotal</td><td style="padding: 4px 0; text-align: right;">${formatPrice(order.subtotal)}</td></tr>
      ${order.discount ? `<tr><td style="padding: 4px 0;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td><td style="padding: 4px 0; text-align: right;">-${formatPrice(order.discount)}</td></tr>` : ''}
      <tr><td style="padding: 4px 0;">Shipping</td><td style="padding: 4px 0; text-align: right;">${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</td></tr>
      <tr><td style="padding: 8px 0 0; font-weight: 800; font-size: 14px;">Total</td><td style="padding: 8px 0 0; text-align: right; font-weight: 800; font-size: 14px;">${formatPrice(order.total)}</td></tr>
    </table>
    <p style="font-size: 12px; line-height: 1.6; color: #71717a; margin: 20px 0 0;">
      Shipping to:<br/>${addr.fullName}, ${addr.line1}${addr.line2 ? `, ${addr.line2}` : ''}, ${addr.city}, ${addr.state} ${addr.pincode}
    </p>
    <a href="${orderUrl}"
       style="display: inline-block; margin-top: 20px; background: #18181b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 14px 24px; border-radius: 8px;">
      View order
    </a>
  </div>`.trim();
}

function orderConfirmationText(order: Order, orderUrl: string): string {
  const lines = order.items
    .map((item) => {
      const opts = formatSelectedOptions(item.selectedOptions);
      return `- ${item.name}${opts ? ` (${opts})` : ''} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
    })
    .join('\n');
  return `Order confirmed — ${BRAND.name}\n\nOrder ID: ${order.id}\n\n${lines}\n\nSubtotal: ${formatPrice(order.subtotal)}\n${order.discount ? `Discount: -${formatPrice(order.discount)}\n` : ''}Shipping: ${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}\nTotal: ${formatPrice(order.total)}\n\n${orderUrl}`;
}

export const EmailService = {
  isConfigured: isEmailConfigured,

  /**
   * Sends the password-reset email. Never throws — a delivery failure is
   * logged server-side and returned as { sent: false } so the calling route
   * can still return its enumeration-safe generic response to the client.
   */
  async sendPasswordResetEmail(toEmail: string, resetUrl: string): Promise<SendResult> {
    return sendViaBrevo({
      toEmail,
      subject: `Reset your ${BRAND.name} password`,
      html: resetPasswordEmailHtml(resetUrl),
      text: resetPasswordEmailText(resetUrl),
    });
  },

  /** Sends an order-confirmation receipt with every line item's selected options. Never throws. */
  async sendOrderConfirmationEmail(toEmail: string, order: Order, orderUrl: string): Promise<SendResult> {
    return sendViaBrevo({
      toEmail,
      subject: `Your ${BRAND.name} order is confirmed (#${order.id.slice(-8)})`,
      html: orderConfirmationHtml(order, orderUrl),
      text: orderConfirmationText(order, orderUrl),
    });
  },
};
