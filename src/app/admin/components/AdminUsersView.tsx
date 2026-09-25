'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Pagination from './ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import type { User } from '@/types';

interface AdminUserRow extends User {
  createdAt: string;
  cartItemCount: number;
  wishlistItemCount: number;
  orderCount: number;
}

export default function AdminUsersView() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');

  const load = () => {
    fetch('/api/admin/users').then((r) => r.json()).then((json) => setUsers(json?.data?.users ?? []));
  };
  useEffect(load, []);

  const visible = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || (u.role ?? 'customer') === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, search, roleFilter]);

  const { page, setPage, totalPages, pageSize, paged, totalItems } = usePagination(visible);
  useEffect(() => setPage(1), [search, roleFilter, setPage]);

  const handleDelete = async (user: AdminUserRow) => {
    if (!confirm(`Delete "${user.name}"? This removes their cart and wishlist data too. This can't be undone.`)) return;
    setError('');
    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok || !json.success) {
      setError(json?.error?.message || 'Could not delete user');
      return;
    }
    load();
  };

  return (
    <div>
      <h1 className="font-display font-black uppercase text-3xl text-foreground">Users</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-sm rounded-xl border border-border px-4 py-2.5 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'customer' | 'admin')}
          className="rounded-xl border border-border px-4 py-2.5 text-sm bg-white">
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary">{error}</p>}

      {!users ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
      ) : visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {users.length === 0 ? 'No users yet.' : 'No users match your search.'}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Role</th>
                <th className="px-4 py-3 font-bold">Orders</th>
                <th className="px-4 py-3 font-bold">Cart</th>
                <th className="px-4 py-3 font-bold">Wishlist</th>
                <th className="px-4 py-3 font-bold">Joined</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-foreground max-w-[200px] truncate">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[220px] truncate">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/40 text-muted-foreground'}`}>
                      {u.role ?? 'customer'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{u.orderCount}</td>
                  <td className="px-4 py-3 text-foreground">{u.cartItemCount}</td>
                  <td className="px-4 py-3 text-foreground">{u.wishlistItemCount}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/users/${u.id}`} className="text-xs font-bold text-foreground hover:text-primary mr-4">View</Link>
                    <button onClick={() => handleDelete(u)} disabled={busyId === u.id} className="text-xs font-bold text-primary disabled:opacity-60">
                      {busyId === u.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
