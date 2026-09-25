import React from 'react';
import Link from 'next/link';

export function Card({
  children,
  className = '',
  padding = 'p-5 sm:p-6',
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card ${padding} ${className}`}>{children}</div>
  );
}

export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

export function ViewAllLink({ href, children = 'View all' }: { href: string; children?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity whitespace-nowrap">
      {children} →
    </Link>
  );
}
