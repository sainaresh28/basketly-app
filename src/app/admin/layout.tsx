import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth/guards';
import { AuthService } from '@/lib/services/auth.service';
import AdminNav from './components/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/admin');

  const user = await AuthService.getProfile(session.userId);
  if (!user || user.role !== 'admin') redirect('/account');

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userName={user.name} />
      <main className="pt-20 lg:pt-24 pb-16 px-4 sm:px-6 lg:px-10 max-w-[1300px] mx-auto">
        {children}
      </main>
    </div>
  );
}
