/** Turns { ram: '16GB', color: 'Black' } into "RAM: 16GB · Color: Black" for cart/order/invoice display. */
export function formatSelectedOptions(options?: Record<string, string>): string {
  if (!options) return '';
  return Object.entries(options)
    .filter(([, v]) => v)
    .map(([key, value]) => {
      const label = key.length <= 3
        ? key.toUpperCase() // RAM, OS, etc.
        : key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
      return `${label}: ${value}`;
    })
    .join(' · ');
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}