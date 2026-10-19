import { describe, it, expect } from 'vitest';
import { cartLineKey } from './cart.repository';

describe('cartLineKey', () => {
  it('returns the bare product id when there are no selected options', () => {
    expect(cartLineKey('p-001')).toBe('p-001');
    expect(cartLineKey('p-001', {})).toBe('p-001');
  });

  it('is deterministic for the same options regardless of insertion order', () => {
    const a = cartLineKey('p-001', { color: 'Black', size: 'M' });
    const b = cartLineKey('p-001', { size: 'M', color: 'Black' });
    expect(a).toBe(b);
  });

  it('produces different keys for different variants of the same product', () => {
    const black = cartLineKey('p-001', { color: 'Black', size: 'M' });
    const red = cartLineKey('p-001', { color: 'Red', size: 'M' });
    expect(black).not.toBe(red);
  });

  it('produces different keys for the same options on different products', () => {
    const a = cartLineKey('p-001', { color: 'Black' });
    const b = cartLineKey('p-002', { color: 'Black' });
    expect(a).not.toBe(b);
  });

  it('drops empty-string option values so they do not affect the key', () => {
    const withEmpty = cartLineKey('p-001', { color: 'Black', size: '' });
    const without = cartLineKey('p-001', { color: 'Black' });
    expect(withEmpty).toBe(without);
  });

  it('stays stable and collision-free across 3+ dimensions', () => {
    const a = cartLineKey('p-005', { color: 'Black', ram: '16GB', storage: '512GB' });
    const b = cartLineKey('p-005', { storage: '512GB', color: 'Black', ram: '16GB' });
    const c = cartLineKey('p-005', { color: 'Black', ram: '8GB', storage: '512GB' });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});
