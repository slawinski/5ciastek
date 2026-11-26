import { decimal, divide, fixed, times } from '../economics-investment/money';
import { quantitySchema } from '../investment-scenarios/values';
import type { QuantityConversion } from '../investment-scenarios/values';

export const quantityUnits = (value: string) => {
  const parsed = quantitySchema.parse({ value, unit: 'g' });
  const [whole, fraction = ''] = parsed.value.split('.');
  return BigInt(whole) * 1000n + BigInt(fraction.padEnd(3, '0'));
};
export function quantityText(value: bigint) { return fixed(times(decimal(value.toString()), decimal('0.001')), 3).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, ''); }
export function convertQuantity(value: string, fromUnit: string, toUnit: string, conversion?: QuantityConversion) {
  if (fromUnit === toUnit) return decimal(value);
  if (!conversion || conversion.from.unit !== fromUnit || conversion.to.unit !== toUnit || conversion.evidence.status === 'missing') throw new Error('Brak jawnej konwersji jednostek.');
  return times(decimal(value), divide(decimal(conversion.to.value), decimal(conversion.from.value)));
}
