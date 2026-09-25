import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth/guards';
import AdminShell from './components/AdminShell';

export const dynamic = 'force-dynamic';

// The role lives on the session JWT itself (see lib/auth/session.ts), so
// gating the admin shell only needs to decode the cookie — no DynamoDB
// round trip. This used to also call AuthService.getProfile() to look up
// the role, which added a full extra DB request to *every* admin page
// navigation (this layout wraps every /admin/* route). Every privileged
// write still goes through requireAdmin() in the API routes, which does
// re-verify the role against the database, so this shortcut only affects
// how fast the UI shell renders, never what mutations are allowed.
//
// One tradeoff: if a user is promoted/demoted via scripts/make-admin.ts
// while they're already signed in, their existing session won't reflect
// it until they log in again.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/admin');
  if (session.role !== 'admin') redirect('/account');

  return <AdminShell userName={session.name}>{children}</AdminShell>;
}
