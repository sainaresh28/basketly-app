'use client';
import React, { useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';
import { useCartStore } from '@/lib/cart-store';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const addToast = useCartStore((s) => s.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      addToast('Enter a valid email address', 'error');
      return;
    }
    addToast('You\u2019re on the list — welcome to Basketly', 'success');
    setEmail('');
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[640px] mx-auto text-center">
        <span className="w-11 h-11 rounded-full bg-secondary/40 flex items-center justify-center mx-auto mb-5">
          <AppIcon name="SparklesIcon" size={22} className="text-primary" />
        </span>
        <h2 className="font-display font-black uppercase text-display-lg text-foreground leading-[0.9]">
          Good Taste,<br />Delivered Monthly.
        </h2>
        <p className="text-sm text-muted-foreground mt-4 max-w-sm mx-auto">
          A note from our editors with new finds, old favourites and 10% off your first basket.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 flex items-center gap-2 border-b-2 border-foreground max-w-[430px] mx-auto">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            className="w-full bg-transparent px-1 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" className="flex items-center gap-1.5 px-2 py-3 text-sm font-bold text-foreground hover:text-primary transition-colors shrink-0">
            Join
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
