'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { User } from '@/types';

export default function EditProfileForm({ user }: { user: User }) {
  const { refresh } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message || 'Could not update your profile');
      await refresh();
      setStatus('idle');
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your profile');
      setStatus('error');
    }
  };

  if (!editing) {
    return (
      <div className="rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Profile Information</h3>
          <button onClick={() => setEditing(true)} className="text-xs font-bold uppercase tracking-wide text-foreground border-b-2 border-foreground pb-0.5 hover:text-primary hover:border-primary transition-colors">
            Edit
          </button>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 rounded-full bg-secondary/40 flex items-center justify-center text-lg font-bold text-foreground overflow-hidden">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{user.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{user.phone || 'No phone number on file'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border p-6">
      <h3 className="text-base font-bold text-foreground">Edit Profile</h3>
      <div className="mt-4 space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <label className="block text-sm font-semibold text-foreground">
          Phone
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Add a phone number"
            className="mt-1.5 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
      </div>
      {error && <p role="alert" className="mt-3 text-xs font-semibold text-primary">{error}</p>}
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={status === 'saving'} className="btn-dark py-2.5 px-5 text-xs disabled:opacity-60">
          {status === 'saving' ? 'Saving…' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-sm font-bold text-muted-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}
