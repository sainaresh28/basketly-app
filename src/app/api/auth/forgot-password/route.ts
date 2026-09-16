import { withErrorHandling, ok } from '@/lib/errors/handler';
import { forgotPasswordSchema } from '@/lib/validation/schemas';
import { AuthService } from '@/lib/services/auth.service';
import { EmailService } from '@/lib/services/email.service';

export const POST = withErrorHandling(async (req: Request) => {
  const body = await req.json();
  const { email } = forgotPasswordSchema.parse(body);

  const result = await AuthService.requestPasswordReset(email);

  // Same response whether or not the email is registered, so this endpoint
  // can't be used to enumerate accounts.
  let devResetUrl: string | undefined;

  if (result) {
    if (EmailService.isConfigured()) {
      // Real email provider configured (see EMAIL_FROM_ADDRESS / BREVO_API_KEY
      // in .env) — actually send the reset link. Delivery failures are logged
      // server-side but never change the response, to keep the enumeration
      // protection intact.
      await EmailService.sendPasswordResetEmail(email, result.resetUrl);
    } else {
      // No email provider configured yet — log the link server-side and, in
      // non-production, hand it back to the client too so the flow stays
      // testable without setting up email.
      console.log(`[password-reset] ${email} -> ${result.resetUrl}`);
      if (process.env.NODE_ENV !== 'production') {
        devResetUrl = result.resetUrl;
      }
    }
  }

  return ok({
    message: 'If an account exists for that email, a reset link has been sent.',
    devResetUrl,
  });
});
