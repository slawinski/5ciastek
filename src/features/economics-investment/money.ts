import { add, ratio, type Rational } from '../recipes/precision';

export { add, ratio };
export function decimal(value: string): Rational {
  if (!/^-?\d+(?:\.\d+)?$/.test(value)) throw new Error('Niepoprawna liczba dziesiętna.');
  const negative = value.startsWith('-'); const [whole, fraction = ''] = value.replace('-', '').split('.');
  return ratio((negative ? -1n : 1n) * BigInt(whole + fraction), 10n ** BigInt(fraction.length));
}
export const times = (a: Rational, b: Rational) => ratio(a.numerator * b.numerator, a.denominator * b.denominator);
export const subtract = (a: Rational, b: Rational) => add(a, ratio(-b.numerator, b.denominator));
export function divide(a: Rational, b: Rational) {
  if (b.numerator === 0n) throw new Error('Nie można dzielić przez zero.');
  return ratio(a.numerator * b.denominator * (b.numerator < 0n ? -1n : 1n), a.denominator * (b.numerator < 0n ? -b.numerator : b.numerator));
}
export const compare = (a: Rational, b: Rational) => a.numerator * b.denominator - b.numerator * a.denominator;
export const ceil = (a: Rational) => a.numerator <= 0n ? a.numerator / a.denominator : (a.numerator + a.denominator - 1n) / a.denominator;
export function fixed(value: Rational, places: number): string {
  const sign = value.numerator < 0n ? '-' : ''; const absolute = value.numerator < 0n ? -value.numerator : value.numerator;
  const scale = 10n ** BigInt(places); const rounded = (absolute * scale * 2n + value.denominator) / (2n * value.denominator);
  return `${rounded === 0n ? '' : sign}${rounded / scale}${places ? `.${String(rounded % scale).padStart(places, '0')}` : ''}`;
}
export const money = (value: Rational) => fixed(value, 2);
