import type { z } from 'zod';
import type { requiredSalesSchema } from './schema';
import { known } from '../investment-scenarios/values';
import { add, ceil, compare, decimal, divide, money, ratio, subtract, times } from './money';

export interface RequiredSalesResult { status: 'calculated' | 'unverified' | 'no-finite-solution'; sold: Record<string, string>; produced: Record<string, string>; revenue: string | null; variableCost: string | null; contribution: string | null; period: string; reason: string }
export function requiredSales(input: z.infer<typeof requiredSalesSchema>): RequiredSalesResult {
  const result: RequiredSalesResult = { status: 'unverified', sold: {}, produced: {}, revenue: null, variableCost: null, contribution: null, period: input.period, reason: 'Brak budżetu, miksu, ceny, kosztu lub strat.' };
  const budget = known(input.budget);
  if (budget === null || !input.mix.length) return result;
  const rows = input.mix.map(row => ({ ...row, priceValue: known(row.price), costValue: known(row.unitCost), lossValue: known(row.lossPercent) }));
  if (rows.some(row => row.priceValue === null || row.costValue === null || row.lossValue === null)) return result;
  if (rows.some(row => compare(decimal(row.lossValue!), decimal('100')) >= 0n)) return { ...result, status: 'no-finite-solution', reason: 'Strata 100% nie daje skończonej sprzedaży.' };
  const bundleRevenue = rows.reduce((sum, row) => add(sum, times(decimal(String(row.soldPieces)), decimal(row.priceValue!))), ratio(0n));
  const bundleCost = rows.reduce((sum, row) => add(sum, times(divide(decimal(String(row.soldPieces)), subtract(decimal('1'), divide(decimal(row.lossValue!), decimal('100')))), decimal(row.costValue!))), ratio(0n));
  const contribution = subtract(bundleRevenue, bundleCost);
  if (contribution.numerator <= 0n && decimal(budget).numerator > 0n) return { ...result, status: 'no-finite-solution', reason: 'Niedodatni wkład miksu nie pokryje dodatniego budżetu.' };
  let bundles = decimal(budget).numerator === 0n ? 0n : ceil(divide(decimal(budget), contribution));
  const calculate = (count: bigint) => {
    const produced = rows.map(row => ceil(divide(ratio(count * BigInt(row.soldPieces)), subtract(decimal('1'), divide(decimal(row.lossValue!), decimal('100'))))));
    const revenue = times(bundleRevenue, ratio(count));
    const cost = rows.reduce((sum, row, index) => add(sum, times(ratio(produced[index]), decimal(row.costValue!))), ratio(0n));
    return { produced, revenue, cost, contribution: subtract(revenue, cost) };
  };
  // Rounding each product up can add at most one unit cost per product.
  // Jump by that exact coverage deficit rather than scanning individual pieces.
  let totals = calculate(bundles);
  while (compare(totals.contribution, decimal(budget)) < 0n) {
    bundles += ceil(divide(subtract(decimal(budget), totals.contribution), contribution));
    totals = calculate(bundles);
  }
  rows.forEach((row, index) => { result.sold[row.productId] = (bundles * BigInt(row.soldPieces)).toString(); result.produced[row.productId] = totals.produced[index].toString(); });
  return { ...result, status: 'calculated', revenue: money(totals.revenue), variableCost: money(totals.cost), contribution: money(totals.contribution), reason: 'Miks sprzedanych sztuk; całe pakiety miksu, produkcja zaokrąglona w górę. Wymaganie nie jest prognozą popytu.' };
}
