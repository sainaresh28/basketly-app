import React from 'react';
import type { Metadata } from 'next';
import InvoiceView from './InvoiceView';

export const metadata: Metadata = { title: 'Invoice — Basketly' };

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvoiceView orderId={id} />;
}
