/**
 * Runs a server-side data call and falls back instead of crashing the whole page
 * if the underlying data source (e.g. DynamoDB) is unreachable or misconfigured —
 * for example, when AWS credentials aren't available in the current environment.
 */
export async function safe<T>(promise: Promise<T>, fallback: T, label?: string): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[safe] ${label || 'data call'} failed, using fallback:`, err instanceof Error ? err.message : err);
    }
    return fallback;
  }
}
