import { withErrorHandling, ok } from '@/lib/errors/handler';
import { resetPasswordSchema } from '@/lib/validation/schemas';
import { AuthService } from '@/lib/services/auth.service';

export const POST = withErrorHandling(async (req: Request) => {
  const body = await req.json();
  const { uid, token, password } = resetPasswordSchema.parse(body);

  await AuthService.resetPassword(uid, token, password);

  return ok({ message: 'Your password has been reset. You can sign in now.' });
});
