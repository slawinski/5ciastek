import { describe, expect, it } from 'vitest';
import { grams, roundGrams, ratio } from './precision';

describe('DEC-001 mass boundaries', () => {
  it('preserves thousandths and rejects finer precision and invalid masses', () => {
    expect(grams('1.235')).toBe(1235n);
    for (const value of ['1.2345', '0', '-1', 'NaN', '1e3']) expect(() => grams(value)).toThrow();
  });
  it('rounds exact positive half ties upwards', () => {
    expect(roundGrams(ratio(1n, 2n))).toBe('0.001');
    expect(roundGrams(ratio(2469n, 2n))).toBe('1.235');
    expect(roundGrams(ratio(2468n, 2n))).toBe('1.234');
  });
});
