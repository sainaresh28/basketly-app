'use client';
import React from 'react';
import Link from 'next/link';
import AccountSidebar, { MobileAccountNav, type AccountSection } from './AccountSidebar';

export default function AccountShell({
  active,
  crumb,
  eyebrow,
  title,
  subtitle,
  tagline,
  headerAction,
  children,
}: {
  active: AccountSection;
  crumb?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  tagline?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1500px] mx-auto">
        {crumb && (
          <p className="mb-5 hidden sm:block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            {' / '}
            <Link href="/account" className="hover:text-primary">Account</Link>
            {' / '}
            <span className="text-foreground">{crumb}</span>
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-10">
          <AccountSidebar active={active} />
          <div className="min-w-0">
            <MobileAccountNav active={active} />

            {(title || tagline || headerAction) && (
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 sm:mb-8">
                <div className="min-w-0">
                  {eyebrow && <span className="section-label mb-2 sm:mb-3">{eyebrow}</span>}
                  {title && (
                    <h1 className="font-display font-black uppercase text-display-lg text-foreground leading-[0.9]">
                      {title}
                    </h1>
                  )}
                  {subtitle && <p className="mt-2 text-sm text-muted-foreground max-w-md">{subtitle}</p>}
                </div>
                <div className="flex items-start gap-4 shrink-0">
                  {tagline && (
                    <p className="hidden sm:block font-script text-2xl leading-6 text-foreground/40 text-right -rotate-1 shrink-0">
                      {tagline.split(' ').reduce<string[]>((lines, word, i) => {
                        const idx = i < 2 ? 0 : 1;
                        lines[idx] = lines[idx] ? `${lines[idx]} ${word}` : word;
                        return lines;
                      }, []).map((line, i) => <span key={i} className="block">{line}</span>)}
                    </p>
                  )}
                  {headerAction}
                </div>
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
