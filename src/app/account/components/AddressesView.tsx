'use client';
import React, { useEffect, useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';
import type { Address } from '@/types';
import AccountShell from './AccountShell';

const emptyForm = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

const LABEL_ICON: Record<string, string> = { Home: 'HomeIcon', Work: 'BuildingOffice2Icon' };

function AddressCard({
  address,
  busy,
  onEdit,
  onSetDefault,
  onRemove,
}: {
  address: Address;
  busy: boolean;
  onEdit: () => void;
  onSetDefault: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border p-5 sm:p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 shrink-0 rounded-full bg-muted flex items-center justify-center">
          <AppIcon name={LABEL_ICON[address.label] || 'MapPinIcon'} size={19} className="text-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {address.isDefault && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">Default</span>
            )}
            {!address.isDefault && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{address.label}</span>
            )}
          </div>
          <p className="mt-2 text-sm font-bold text-foreground">{address.fullName || 'Basketly customer'}</p>
          <p className="mt-1 text-sm text-muted-foreground leading-6 max-w-xs">
            {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
            {address.city}, {address.state} – {address.pincode}<br />
            India
            {address.phone ? <><br />+91 {address.phone.replace(/^\+?91\s?/, '')}</> : null}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 w-full sm:w-auto flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-foreground hover:border-foreground transition-colors"
          >
            <AppIcon name="PencilSquareIcon" size={14} /> Edit
          </button>
          <button
            onClick={onRemove}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            <AppIcon name="TrashIcon" size={14} /> Remove
          </button>
        </div>
        {!address.isDefault && (
          <button onClick={onSetDefault} disabled={busy} className="text-xs font-bold text-foreground hover:text-primary">
            Set as default
          </button>
        )}
      </div>
    </div>
  );
}

export default function AddressesView() {
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

  const hasAddresses = (addresses?.length ?? 0) > 0;

  return (
    <AccountShell
      active="addresses"
      crumb="Addresses"
      title={<>Saved <span className="text-primary">Addresses</span></>}
      subtitle="Manage your delivery addresses for a faster and smoother checkout experience."
      headerAction={
        hasAddresses && !showForm ? (
          <button onClick={startAdd} className="btn-dark py-3 px-5 text-xs inline-flex items-center gap-2 shrink-0 whitespace-nowrap">
            <AppIcon name="PlusIcon" size={15} /> Add New Address
          </button>
        ) : undefined
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          {!addresses ? (
            <div className="h-40 animate-pulse rounded-3xl bg-muted" />
          ) : !hasAddresses && !showForm ? (
            <div className="rounded-3xl border border-border p-10 sm:p-14 flex flex-col items-center text-center">
              <AppIcon name="MapPinIcon" size={56} className="text-primary/60" />
              <h2 className="mt-6 font-display font-black uppercase text-2xl text-foreground">No addresses saved yet.</h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Add a delivery address to make checkout quicker and keep your favourite addresses handy.
              </p>
              <button onClick={startAdd} className="btn-dark mt-6 py-3 px-6 text-xs inline-flex items-center gap-2">
                <AppIcon name="PlusIcon" size={15} /> Add New Address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses!.map((a) => (
                <AddressCard
                  key={a.id}
                  address={a}
                  busy={busy}
                  onEdit={() => startEdit(a)}
                  onSetDefault={() => setDefault(a.id)}
                  onRemove={() => remove(a.id)}
                />
              ))}
            </div>
          )}

          {showForm && (
            <form onSubmit={submit} className="mt-6 rounded-2xl border border-border p-6">
              <h3 className="text-base font-bold text-foreground">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
              {error && <p role="alert" className="mt-3 text-xs font-semibold text-primary">{error}</p>}
              <div className="mt-4 flex gap-3">
                <button type="submit" disabled={busy} className="btn-dark py-2.5 px-5 text-xs disabled:opacity-60">
                  {busy ? 'Saving…' : editingId ? 'Save Address' : 'Add Address'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm font-bold text-muted-foreground">Cancel</button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">
              {hasAddresses ? 'Multiple Addresses, More Convenience' : 'Why Save an Address?'}
            </h3>
            {hasAddresses ? (
              <p className="mt-2 text-xs text-muted-foreground leading-5">
                Save home, work or any other address and choose the one you need at checkout.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {[
                  { icon: 'BoltIcon', title: 'Faster Checkout', sub: 'Save time at checkout with pre-filled details.' },
                  { icon: 'ShieldCheckIcon', title: 'Secure & Safe', sub: 'Your information is encrypted and kept secure.' },
                  { icon: 'MapPinIcon', title: 'Multiple Addresses', sub: 'Save home, work or any other address for your convenience.' },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-secondary/30 flex items-center justify-center">
                      <AppIcon name={f.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasAddresses && (
            <div className="rounded-2xl border border-border p-6">
              <h3 className="text-sm font-bold text-foreground">Tips</h3>
              <div className="mt-4 space-y-4">
                {[
                  { icon: 'HomeIcon', title: 'Set a default address', sub: 'Your default address will be pre-selected at checkout.' },
                  { icon: 'PencilSquareIcon', title: 'Keep your details updated', sub: 'Make sure your phone number and address are correct.' },
                  { icon: 'ShieldCheckIcon', title: 'Your information is safe', sub: 'We keep your address details secure and private.' },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <AppIcon name={f.icon} size={17} className="text-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
