export interface Rational { numerator: bigint; denominator: bigint }

export const ratio = (numerator: bigint, denominator = 1n): Rational => {
  if (denominator <= 0n) throw new Error('Niepoprawny dzielnik.');
  return { numerator, denominator };
};

export const add = (a: Rational, b: Rational) => ratio(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
export const multiply = (a: Rational, numerator: bigint, denominator = 1n) => ratio(a.numerator * numerator, a.denominator * denominator);

export function percent(value: Rational, base: Rational): string {
  const numerator = value.numerator * base.denominator * 10000n;
  const denominator = value.denominator * base.numerator;
  const rounded = (numerator * 2n + denominator) / (2n * denominator);
  return (Number(rounded) / 100).toString();
}

export function grams(value: string): bigint {
  if (!/^\d+(?:\.\d{1,3})?$/.test(value)) throw new Error('Podaj masę w g z dokładnością do 0,001 g.');
  const [whole, decimal = ''] = value.split('.');
  const mass = BigInt(whole) * 1000n + BigInt(decimal.padEnd(3, '0'));
  if (mass <= 0n) throw new Error('Masa musi być dodatnia.');
  return mass;
}

export function roundGrams(value: Rational): string {
  const rounded = (value.numerator * 2n + value.denominator) / (2n * value.denominator);
  return `${rounded / 1000n}.${String(rounded % 1000n).padStart(3, '0')}`;
}
