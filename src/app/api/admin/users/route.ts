import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { UserService } from '@/lib/services/user.service';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const users = await UserService.listAll();
  return ok({ users });
});
