/**
 * A minimal in-memory cache for data that's read far more often than it
 * changes and is the same for every visitor (the product catalog, the
 * category list). It is NOT for per-user data (a cart, a wishlist, orders
 * "for this user") — those are cheap indexed lookups already, mutate on
 * almost every request, and must never be shared across users.
 *
 * This lives in the Node process's memory, so on a long-lived server it
 * persists across requests and genuinely avoids repeat DynamoDB Scans —
 * which, on every previous version of this code, ran on *every single*
 * page load across the whole storefront (home, products, new-arrivals,
 * sale, product detail, cart, checkout, and the admin dashboard all called
 * ProductRepository.findAll() / CategoryRepository.findAll() independently,
 * each one a full table Scan over the network to DynamoDB). On a
 * per-request serverless instance this simply has no effect (each
 * invocation starts with an empty cache) — it degrades to today's
 * behavior rather than breaking anything.
 */
const store = new Map<string, { value: unknown; expiresAt: number }>();
const inflight = new Map<string, Promise<unknown>>();

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;

  // Collapse concurrent misses for the same key into a single DB call
  // instead of letting N simultaneous requests all trigger their own Scan.
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = fn()
    .then((value) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, promise);
  return promise;
}

/** Call after a write so the next read reflects it immediately instead of waiting out the TTL. */
export function invalidateCache(key: string) {
  store.delete(key);
}
