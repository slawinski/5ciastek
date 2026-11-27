import { z } from 'zod';
import { investmentSchema } from '../investment-scenarios/schema-v2';
import { qualifiedValueSchema } from './month';
import { add, compare, decimal, divide, money, ratio } from './money';

export const investmentCategoryLabels = { equipment: 'Wyposażenie', premises: 'Przygotowanie lokalu', deposit: 'Kaucja', initialStock: 'Zapas początkowy' };
const paybackBasis = 'Nakład / powtarzalna miesięczna nadwyżka gotówkowa po rezerwie dochodu właściciela';
const paybackSchema = z.discriminatedUnion('status', [
  z.strictObject({ status: z.literal('calculated'), months: z.string(), reasons: z.array(z.string()) }),
  z.strictObject({ status: z.literal('no-finite-payback'), months: z.null(), reasons: z.array(z.string()) }),
  z.strictObject({ status: z.literal('unverified'), months: z.null(), reasons: z.array(z.string()) }),
]);
export const investmentReportSchema = z.strictObject({
  categories: investmentSchema, outlay: qualifiedValueSchema,
  period: z.string().nullable(), basis: z.string(),
  recurringCash: qualifiedValueSchema.nullable(), repeatability: qualifiedValueSchema.nullable(), payback: paybackSchema,
});
type MonthlyBasis = { period: string; recurringCash: z.infer<typeof qualifiedValueSchema>; repeatability: z.infer<typeof qualifiedValueSchema> };

/** Consumes U5's cash bridge; initial stock and deposits are not new monthly payments. */
export function evaluateInvestment(categories: z.infer<typeof investmentSchema>, monthly: MonthlyBasis | null): z.infer<typeof investmentReportSchema> {
  const outlayReasons: string[] = [];
  const periods = new Set<string>(); let total = ratio(0n);
  for (const key of Object.keys(investmentCategoryLabels) as (keyof typeof investmentCategoryLabels)[]) {
    const row = categories[key]; const label = investmentCategoryLabels[key];
    if (row.status === 'missing') { outlayReasons.push(`${label}: ${row.reason}`); continue; }
    if (row.unit !== 'PLN') outlayReasons.push(`${label}: wymagana kwota PLN.`);
    periods.add(row.period); total = add(total, decimal(row.value));
  }
  if (periods.size > 1) outlayReasons.push('Kategorie nakładu wymagają wspólnego okresu początkowego.');
  const outlay = { status: outlayReasons.length ? 'unverified' as const : 'qualified' as const, value: outlayReasons.length ? null : money(total), unit: 'PLN', period: periods.size === 1 ? [...periods][0] : 'nieustalony', basis: 'Wyposażenie + przygotowanie lokalu + kaucja + zapas początkowy, każdy raz', reasons: outlayReasons };
  const reasons = [...outlayReasons];
  if (!monthly) reasons.push('Brak oceny miesiąca i powtarzalnej nadwyżki po dochodzie właściciela.');
  else {
    for (const [label, row] of [['Nadwyżka gotówkowa', monthly.recurringCash], ['Powtarzalność', monthly.repeatability]] as const) {
      if (row.status !== 'qualified' || row.value === null) reasons.push(`${label}: niezweryfikowane.`, ...row.reasons);
      if (row.period !== monthly.period) reasons.push(`${label}: okres nie odpowiada miesiącowi ${monthly.period}.`);
    }
    if (monthly.recurringCash.unit !== 'PLN' || monthly.repeatability.unit !== 'qualification') reasons.push('Niezgodne jednostki miesięcznej podstawy zwrotu.');
  }
  let payback: z.infer<typeof paybackSchema>;
  if (reasons.length || !monthly || monthly.recurringCash.value === null) payback = { status: 'unverified', months: null, reasons: [...new Set(reasons)] };
  else {
    const cash = decimal(monthly.recurringCash.value);
    payback = compare(cash, ratio(0n)) <= 0n
      ? { status: 'no-finite-payback', months: null, reasons: ['Znana miesięczna nadwyżka po dochodzie właściciela jest niedodatnia.'] }
      : { status: 'calculated', months: money(divide(total, cash)), reasons: [] };
  }
  return { categories, outlay, period: monthly?.period ?? null, basis: paybackBasis, recurringCash: monthly?.recurringCash ?? null, repeatability: monthly?.repeatability ?? null, payback };
}
