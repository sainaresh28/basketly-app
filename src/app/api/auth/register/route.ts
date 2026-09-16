import { withErrorHandling, ok } from '@/lib/errors/handler';
import { registerSchema } from '@/lib/validation/schemas';
import { AuthService } from '@/lib/services/auth.service';
import { setSessionCookie } from '@/lib/auth/session';

export const POST = withErrorHandling(async (req: Request) => {
  const body = await req.json();
  const input = registerSchema.parse(body);

  const { user, token } = await AuthService.register(input);
  await setSessionCookie(token);

  return ok({ user }, 201);
});
