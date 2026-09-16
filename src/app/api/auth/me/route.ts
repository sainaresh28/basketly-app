import { withErrorHandling, ok } from '@/lib/errors/handler';
import { getCurrentSession, requireSession } from '@/lib/auth/guards';
import { AuthService } from '@/lib/services/auth.service';
import { updateProfileSchema } from '@/lib/validation/schemas';

export const GET = withErrorHandling(async () => {
  const session = await getCurrentSession();
  if (!session) return ok({ user: null });

  const user = await AuthService.getProfile(session.userId);
  return ok({ user });
});

/** Edit user profile (name, phone). */
export const PATCH = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = updateProfileSchema.parse(body);

  const user = await AuthService.updateProfile(session.userId, input);
  return ok({ user });
});
