import { withErrorHandling, ok } from '@/lib/errors/handler';
import { loginSchema } from '@/lib/validation/schemas';
import { AuthService } from '@/lib/services/auth.service';
import { setSessionCookie } from '@/lib/auth/session';

export const POST = withErrorHandling(async (req: Request) => {
  const body = await req.json();
  const input = loginSchema.parse(body);

  const { user, token } = await AuthService.login(input);
  await setSessionCookie(token);

  return ok({ user });
});
