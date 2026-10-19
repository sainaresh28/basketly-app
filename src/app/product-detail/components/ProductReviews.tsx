'use client';
import React, { useEffect, useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';
import type { Review, Product } from '@/types';

function RatingBreakdown({ distribution, total }: { distribution: NonNullable<Product['ratingDistribution']>; total: number }) {
  return (
    <div className="space-y-1.5 mb-6 max-w-sm">
      {(['5', '4', '3', '2', '1'] as const).map((star) => {
        const count = distribution[star] || 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2.5 text-xs">
            <span className="w-8 shrink-0 font-semibold text-foreground">{star} ★</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 shrink-0 text-muted-foreground text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <AppIcon
          key={n}
          name="StarIcon"
          variant={n <= Math.round(rating) ? 'solid' : 'outline'}
          size={size}
          className={n <= Math.round(rating) ? 'text-secondary' : 'text-muted-foreground/40'}
        />
      ))}
    </div>
  );
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export default function ProductReviews({ productId, rating, reviewCount, ratingDistribution }: { productId: string; rating: number; reviewCount: number; ratingDistribution?: Product['ratingDistribution'] }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) setReviews(j?.data?.reviews ?? []); })
      .catch(() => { if (!cancelled) setReviews([]); });
    return () => { cancelled = true; };
  }, [productId]);

  return (
    <section className="mb-16 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-black uppercase text-2xl text-foreground">Customer Reviews</h2>
          {reviewCount > 0 ? (
            <div className="mt-2 flex items-center gap-2">
              <StarRow rating={rating} size={16} />
              <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">· {reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</p>
          )}
        </div>
      </div>

      {ratingDistribution && reviewCount > 0 && <RatingBreakdown distribution={ratingDistribution} total={reviewCount} />}

      {reviews === null ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Reviews appear here once customers who&apos;ve received this item share their feedback from their order page.
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{r.userName}</p>
                    <StarRow rating={r.rating} size={12} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{timeAgo(r.createdAt)}</span>
              </div>
              <p className="mt-3 text-sm text-foreground/90 leading-relaxed">{r.comment}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                <AppIcon name="CheckBadgeIcon" size={13} /> Verified Purchase
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
