'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import type { Address } from '@/types';

export default function DefaultAddressCard() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);

  useEffect(() => {
    fetch('/api/account/addresses')
      .then((r) => r.json())
      .then((json) => setAddresses(json?.data?.addresses ?? []))
      .catch(() => setAddresses([]));
  }, []);

  const primary = addresses?.find((a) => a.isDefault) ?? addresses?.[0] ?? null;

  return (
    <div className="rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">Default Address</h3>
        <Link href="/account/addresses" className="text-xs font-bold uppercase tracking-wide text-foreground border-b-2 border-foreground pb-0.5 hover:text-primary hover:border-primary transition-colors">
          Edit
        </Link>
      </div>

      {!addresses ? (
        <div className="mt-5 h-16 animate-pulse rounded-xl bg-muted" />
      ) : !primary ? (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">No address saved yet.</p>
          <Link href="/account/addresses" className="mt-2 inline-block text-xs font-bold text-primary">+ Add an address</Link>
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-4">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-muted flex items-center justify-center">
            <AppIcon name="HomeIcon" size={19} className="text-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{primary.label}</span>
              {primary.isDefault && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">Default</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground leading-6">
              {primary.fullName ? `${primary.fullName}, ` : ''}{primary.line1}{primary.line2 ? `, ${primary.line2}` : ''}<br />
              {primary.city}, {primary.state} {primary.pincode}
              {primary.phone ? <><br />{primary.phone}</> : null}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
