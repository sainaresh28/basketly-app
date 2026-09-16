'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  TruckIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import AppImage from '@/components/ui/AppImage';
import { BRAND } from '@/lib/brand';

type FooterLink = { label: string; href: string };

const FEATURES = [
  { icon: TruckIcon, title: 'Free Delivery', subtitle: 'On orders over ₹2,999' },
  { icon: ShieldCheckIcon, title: 'Secure Payments', subtitle: '100% safe & reliable' },
  { icon: ArchiveBoxIcon, title: 'Easy Returns', subtitle: 'Hassle-free within 7 days' },
] as const;

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links?.map(link => (
          <li key={link?.label}>
            <Link href={link?.href} className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors">
              {link?.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
        </svg>
      );
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.4 1.7-2.4-.8.5-1.7.9-2.6 1.1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.7a4.1 4.1 0 0 0 1.3 5.5c-.6 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.8c7.6 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.3Z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.3C16.5 3.2 15.5 3 14.4 3c-2.4 0-4 1.5-4 4.1v2.7H7.7v3.2h2.7v8h3.1Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
          <rect x="2.2" y="6" width="19.6" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.3 9.4v5.2l4.7-2.6-4.7-2.6Z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

function StretchedWordmark({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scaleX, setScaleX] = useState<number | null>(null);

  useEffect(() => {
    function updateScale() {
      const container = containerRef.current;
      const textEl = textRef.current;
      if (!container || !textEl) return;
      const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
      const availableWidth = container.clientWidth - paddingLeft;
      const textWidth = textEl.scrollWidth;
      if (availableWidth > 0 && textWidth > 0) {
        setScaleX(availableWidth / textWidth);
      }
    }
    updateScale();
    // Re-measure once the custom "Strezy Break Shadow" font finishes loading —
    // measuring against the fallback font first would give the wrong (narrower)
    // width and over-stretch the final glyphs, clipping their edges.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(updateScale);
    }
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [text]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden pl-2 sm:pl-3" aria-hidden="true">
      <span
        ref={textRef}
        className="font-brand uppercase text-foreground leading-[0.75] inline-block whitespace-nowrap select-none text-[15vw] sm:text-[10vw] lg:text-[8vw]"
        style={{
          transform: `scaleX(${scaleX ?? 1})`,
          transformOrigin: 'left center',
          opacity: scaleX === null ? 0 : 1,
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function Footer() {
  const year = new Date()?.getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      {/* Top: tagline / link columns / reminder promo */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14">
        <p className="text-foreground/70 text-base sm:text-lg leading-snug mb-10 max-w-xs">
          Objects with a point of view.
          <br />
          For everyday life.
        </p>

        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-8">
          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 lg:gap-20 flex-1">
            <FooterColumn title="Shop" links={BRAND?.nav?.footer?.shop} />
            <FooterColumn title="Help" links={BRAND?.nav?.footer?.help} />
            <FooterColumn title="Company" links={BRAND?.nav?.footer?.company} />
          </div>

          {/* Reminder + image */}
          <div className="flex gap-8 sm:gap-10 lg:pl-12 lg:border-l lg:border-border lg:w-[540px] lg:shrink-0">
            <div className="w-[170px] sm:w-[190px] shrink-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                A small reminder
              </p>
              <h3 className="font-display font-extrabold uppercase text-3xl leading-[0.95] text-foreground">
                Choose the
                <br />
                thing
                <br />
                <span className="text-primary">you&rsquo;ll use.</span>
              </h3>
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 bg-foreground text-background rounded-full pl-6 pr-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Shop Now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex-1 rounded-3xl overflow-hidden self-start">
              <AppImage
                src="https://images.unsplash.com/photo-1595182170669-9a29f5e851d0?w=600&q=80"
                alt="Featured product"
                width={340}
                height={340}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {FEATURES?.map(feature => (
            <div key={feature?.title} className="flex items-center gap-3 py-6 sm:px-8 first:sm:pl-0 last:sm:pr-0">
              <feature.icon className="w-7 h-7 text-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-bold text-foreground">{feature?.title}</p>
                <p className="text-xs text-muted-foreground">{feature?.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wordmark band */}
      <div className="relative overflow-hidden bg-muted border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="w-full lg:flex-1 min-w-0">
            <StretchedWordmark text={BRAND?.name} />
            <span className="sr-only">{BRAND?.name}</span>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4 pb-6 sm:pb-8 lg:pl-8 shrink-0">
            <div className="flex items-center gap-3">
              {Object.entries(BRAND?.socials)?.map(([platform, href]) => (
                <a
                  key={platform}
                  href={href}
                  aria-label={platform}
                  className="w-10 h-10 rounded-full border border-foreground/15 bg-background flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  <SocialIcon platform={platform} />
                </a>
              ))}
            </div>

            <div className="text-left lg:text-right">
              <p className="text-xs text-muted-foreground">
                © {year} {BRAND?.name}. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}