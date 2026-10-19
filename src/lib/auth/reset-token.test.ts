import { describe, it, expect } from 'vitest';
import { generateResetToken, hashResetToken, safeCompareHashes, RESET_TOKEN_TTL_MS } from './reset-token';

describe('reset-token', () => {
  it('generates a 64-char hex raw token (32 random bytes)', () => {
    const { rawToken } = generateResetToken();
    expect(rawToken).toMatch(/^[0-9a-f]{64}$/);
  });

  it('generates a different token on every call', () => {
    const a = generateResetToken();
    const b = generateResetToken();
    expect(a.rawToken).not.toBe(b.rawToken);
  });

  it('hashes the same raw token to the same hash deterministically', () => {
    const { rawToken, tokenHash } = generateResetToken();
    expect(hashResetToken(rawToken)).toBe(tokenHash);
  });

  it('never stores the raw token inside its own hash', () => {
    const { rawToken, tokenHash } = generateResetToken();
    expect(tokenHash).not.toContain(rawToken);
    expect(tokenHash).toMatch(/^[0-9a-f]{64}$/); // SHA-256 hex digest
  });

  it('safeCompareHashes matches equal hashes and rejects differing ones', () => {
    const h1 = hashResetToken('token-a');
    const h2 = hashResetToken('token-a');
    const h3 = hashResetToken('token-b');
    expect(safeCompareHashes(h1, h2)).toBe(true);
    expect(safeCompareHashes(h1, h3)).toBe(false);
  });

  it('safeCompareHashes handles length-mismatched input without throwing', () => {
    expect(() => safeCompareHashes('short', hashResetToken('x'))).not.toThrow();
    expect(safeCompareHashes('short', hashResetToken('x'))).toBe(false);
  });

  it('TTL is 30 minutes', () => {
    expect(RESET_TOKEN_TTL_MS).toBe(30 * 60 * 1000);
  });
});
