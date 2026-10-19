import { describe, it, expect } from 'vitest';
import { formatSelectedOptions, slugify, formatDiscount } from './format';

describe('formatSelectedOptions', () => {
  it('formats a single option', () => {
    expect(formatSelectedOptions({ color: 'Black' })).toBe('Color: Black');
  });

  it('formats multiple options joined by middots, title-casing each key', () => {
    expect(formatSelectedOptions({ color: 'Black', size: 'M' })).toBe('Color: Black · Size: M');
  });

  it('uppercases short (<=3 char) keys like RAM / OS', () => {
    expect(formatSelectedOptions({ ram: '16GB' })).toBe('RAM: 16GB');
    expect(formatSelectedOptions({ os: 'Android' })).toBe('OS: Android');
  });

  it('returns an empty string for undefined or empty options', () => {
    expect(formatSelectedOptions(undefined)).toBe('');
    expect(formatSelectedOptions({})).toBe('');
  });

  it('drops keys with empty-string values', () => {
    expect(formatSelectedOptions({ color: 'Black', size: '' })).toBe('Color: Black');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips characters outside [\\w-] rather than hyphenating them', () => {
    expect(slugify("Men's T-Shirt")).toBe('mens-t-shirt');
  });

  it('collapses internal multi-space runs into a single hyphen', () => {
    expect(slugify('A   B')).toBe('a-b');
  });
});

describe('formatDiscount', () => {
  it('computes the percentage off, rounded to the nearest integer', () => {
    expect(formatDiscount(1000, 750)).toBe(25);
    expect(formatDiscount(999, 499)).toBe(50);
  });
});
