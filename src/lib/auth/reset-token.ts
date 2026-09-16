import crypto from 'crypto';

/** How long a password-reset link stays valid for. */
export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Generates a random reset token plus its SHA-256 hash. The raw token goes
 * out in the reset link (email/URL); only the hash is ever persisted, so a
 * leaked database can't be used to forge reset links.
 */
export function generateResetToken(): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(32).toString('hex');
  return { rawToken, tokenHash: hashResetToken(rawToken) };
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/** Constant-time comparison so a mistyped/guessed token can't be brute-forced via timing. */
export function safeCompareHashes(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
