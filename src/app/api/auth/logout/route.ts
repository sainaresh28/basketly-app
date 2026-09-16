import { withErrorHandling, ok } from '@/lib/errors/handler';
import { clearSessionCookie } from '@/lib/auth/session';

export const POST = withErrorHandling(async () => {
  await clearSessionCookie();
  return ok({ loggedOut: true });
});
