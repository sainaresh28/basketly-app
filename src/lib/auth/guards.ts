import { ForbiddenError, UnauthorizedError } from '@/lib/errors/app-error';
import { getSessionFromCookies, type SessionPayload } from './session';
import { UserRepository } from '@/lib/repositories/user.repository';

/** Returns the current session, or null if the visitor is a guest. */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  return getSessionFromCookies();
}

/** Returns the current session or throws a 401 — use inside protected route handlers. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSessionFromCookies();
  if (!session) {
    throw new UnauthorizedError('Please sign in to continue');
  }
  return session;
}

/** Returns the current session only if that user has the admin role; throws 401/403 otherwise. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  const user = await UserRepository.findById(session.userId);
  if (!user || user.role !== 'admin') {
    throw new ForbiddenError('Admin access is required for this action');
  }
  return session;
}
