import { z } from 'zod';

export const keySchema = z.string().trim().min(1).max(120);
export const textSchema = z.string().trim().min(1).max(2000);
export const decimalSchema = z.string().max(40).regex(/^\d+(?:\.\d{1,9})?$/);
export const instantSchema = z.string().datetime({ offset: true });
export const evidenceSchema = z.discriminatedUnion('status', [
  z.strictObject({ status: z.literal('missing'), unit: keySchema, reason: textSchema }),
  z.strictObject({ status: z.enum(['measured', 'estimated']), value: decimalSchema, unit: keySchema,
    source: textSchema, date: z.string().date(), version: keySchema, period: keySchema, context: textSchema,
    observationRef: keySchema.optional() }),
]);
export type Evidence = z.infer<typeof evidenceSchema>;
export const known = (value: Evidence): string | null => value.status === 'missing' ? null : value.value;

function offsetMatches(instant: string, zone: string) {
  try {
    const parts = new Intl.DateTimeFormat('sv-SE', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(instant));
    return parts.replace(' ', 'T') === instant.slice(0, 19);
  } catch { return false; }
}
export const intervalSchema = z.strictObject({ start: instantSchema, end: instantSchema, zone: keySchema }).superRefine((value, ctx) => {
  if (Date.parse(value.end) <= Date.parse(value.start)) ctx.addIssue({ code: 'custom', path: ['end'], message: 'Koniec musi następować po początku.' });
  for (const field of ['start', 'end'] as const) if (!offsetMatches(value[field], value.zone)) ctx.addIssue({ code: 'custom', path: [field], message: 'Offset nie odpowiada strefie czasowej.' });
});
export const quantitySchema = z.strictObject({ value: z.string().max(40).regex(/^\d+(?:\.\d{1,3})?$/), unit: z.enum(['g', 'kg', 'piece']) })
  .superRefine((value, ctx) => {
    if (value.unit === 'piece' && !/^\d+$/.test(value.value)) ctx.addIssue({ code: 'custom', path: ['value'], message: 'Liczba sztuk musi być całkowita.' });
  }).transform(value => {
    const [whole, fraction = ''] = value.value.split('.');
    const thousandths = BigInt(whole) * 1000n + BigInt(fraction.padEnd(3, '0'));
    const normalized = value.unit === 'kg' ? thousandths * 1000n : thousandths;
    return { value: `${normalized / 1000n}${normalized % 1000n ? `.${String(normalized % 1000n).padStart(3, '0').replace(/0+$/, '')}` : ''}`, unit: value.unit === 'kg' ? 'g' as const : value.unit };
  });
export interface Qualification { domain: 'people' | 'machines' | 'technology' | 'materials' | 'finance'; identity: string; reason: string }
export const conversionSchema = z.strictObject({ from: quantitySchema, to: quantitySchema, evidence: evidenceSchema })
  .refine(value => value.from.value !== '0' && value.to.value !== '0' && value.evidence.status !== 'missing', 'Konwersja wymaga dodatniej podstawy i źródła.');
export type QuantityConversion = z.infer<typeof conversionSchema>;
