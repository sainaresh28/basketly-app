'use client';
import React, { useEffect, useState } from 'react';
import type { Address } from '@/types';

const emptyForm = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/account/addresses')
      .then((r) => r.json())
      .then((json) => setAddresses(json?.data?.addresses ?? []));
  };
  useEffect(load, []);

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const startEdit = (address: Address) => {
    setForm({
      label: address.label, fullName: address.fullName || '', phone: address.phone || '',
      line1: address.line1, line2: address.line2 || '', city: address.city, state: address.state, pincode: address.pincode,
    });
    setEditingId(address.id);
    setShowForm(true);
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(editingId ? `/api/account/addresses/${editingId}` : '/api/account/addresses', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message || 'Could not save this address');
      setAddresses(json.data.addresses);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this address');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (res.ok && json.success) setAddresses(json.data.addresses);
    setBusy(false);
  };

  const setDefault = async (id: string) => {
    setBusy(true);
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    });
    const json = await res.json();
    if (res.ok && json.success) setAddresses(json.data.addresses);
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Saved Addresses</span>
        {!showForm && (
          <button onClick={startAdd} className="text-xs font-bold text-foreground border-b-2 border-foreground pb-0.5 hover:text-primary hover:border-primary transition-colors">
            + Add Address
          </button>
        )}
      </div>

      {!addresses ? (
        <div className="mt-4 h-16 animate-pulse rounded-xl bg-muted" />
      ) : addresses.length === 0 && !showForm ? (
        <p className="mt-4 text-sm text-muted-foreground">No saved addresses yet — add one to speed up checkout.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-xl border border-border p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-foreground">{a.label}</span>
                {a.isDefault && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">Default</span>
                )}
              </div>
              <p className="mt-1.5 text-muted-foreground">
                {a.fullName ? `${a.fullName} · ` : ''}{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                {a.city}, {a.state} {a.pincode}{a.phone ? ` · ${a.phone}` : ''}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-3 text-xs font-bold">
                <button onClick={() => startEdit(a)} disabled={busy} className="text-foreground hover:text-primary">Edit</button>
                {!a.isDefault && (
                  <button onClick={() => setDefault(a.id)} disabled={busy} className="text-foreground hover:text-primary">Set as default</button>
                )}
                <button onClick={() => remove(a.id)} disabled={busy} className="text-primary hover:opacity-70">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Label (Home, Work…)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
            <input required placeholder="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
            <input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input required placeholder="PIN code" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
          </div>
          {error && <p role="alert" className="text-xs font-semibold text-primary">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="btn-dark py-2.5 px-5 text-xs disabled:opacity-60">
              {busy ? 'Saving…' : editingId ? 'Save Address' : 'Add Address'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-bold text-muted-foreground">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
