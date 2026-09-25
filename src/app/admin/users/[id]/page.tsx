import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserService } from '@/lib/services/user.service';
import { getCurrentSession } from '@/lib/auth/guards';
import { NotFoundError } from '@/lib/errors/app-error';
import AdminUserDetail from '../../components/AdminUserDetail';

export const metadata: Metadata = { title: 'User Details — Basketly Admin' };

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [user, session] = await Promise.all([UserService.getById(id), getCurrentSession()]);
    return <AdminUserDetail user={user} isSelf={session?.userId === id} />;
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }
}
