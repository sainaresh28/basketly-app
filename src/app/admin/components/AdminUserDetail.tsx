'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

interface Props {
  user: User & { createdAt: string };
  isSelf: boolean;
}

export default function AdminUserDetail({ user, isSelf }: Props) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [role, setRole] = useState<'customer' | 'admin'>(user.role ?? 'customer');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, role }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok || !json.success) {
      setError(json?.error?.message || 'Could not save changes');
      return;
    }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${user.name}"? This removes their cart and wishlist data too. This can't be undone.`)) return;
    setError('');
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    const json = await res.json();
    setDeleting(false);
    if (!res.ok || !json.success) {
      setError(json?.error?.message || 'Could not delete user');
      return;
    }
    router.push('/admin/users');
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-display font-black uppercase text-3xl text-foreground">{user.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user.email} · Joined {new Date(user.createdAt).toLocaleDateString()}</p>

      <form onSubmit={handleSave} className="mt-6 max-w-lg space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground normal-case font-normal" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground normal-case font-normal" />
        </label>
        <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Role
          <select
            value={role}
            disabled={isSelf}
            onChange={(e) => setRole(e.target.value as 'customer' | 'admin')}
            className="mt-1.5 block w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground normal-case font-normal bg-white disabled:opacity-60">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          {isSelf && <span className="mt-1 block text-[11px] normal-case font-normal text-muted-foreground">You can't change your own role.</span>}
        </label>

        {error && <p role="alert" className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary">{error}</p>}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-dark py-3 px-6 text-xs disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isSelf}
            title={isSelf ? "You can't delete your own account" : undefined}
            className="text-xs font-bold text-primary disabled:opacity-40">
            {deleting ? 'Deleting…' : 'Delete User'}
          </button>
        </div>
      </form>

      {user.addresses && user.addresses.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Saved Addresses</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 max-w-2xl">
            {user.addresses.map((a) => (
              <div key={a.id} className="rounded-xl border border-border p-4 text-sm text-foreground">
                <p className="font-semibold">{a.label}{a.isDefault ? ' · Default' : ''}</p>
                <p className="mt-1 text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                <p className="text-muted-foreground">{a.city}, {a.state} {a.pincode}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
