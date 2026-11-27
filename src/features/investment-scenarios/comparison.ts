import { z } from 'zod';
import { keySchema } from './values';
import { runBodyV2Schema } from './versioned';
import { decimal, money, subtract } from '../economics-investment/money';

export const selectionSchema = z.strictObject({
  runId: z.number().int().positive(), revisionId: z.number().int().positive(), revisionNumber: z.number().int().positive(),
  scenarioKey: keySchema, fingerprint: z.string().regex(/^[a-f0-9]{64}$/), engineVersion: z.literal('investment-scenario/2'),
});
export const comparisonManifestSchema = z.strictObject({ schemaVersion: z.literal(1), selections: z.array(selectionSchema).min(2) }).superRefine((value, ctx) => {
  if (new Set(value.selections.map(row => row.scenarioKey)).size !== value.selections.length) ctx.addIssue({ code: 'custom', path: ['selections'], message: 'Wybierz co najmniej dwa różne warianty, po jednym przebiegu każdego.' });
});
export type ComparisonManifest = z.infer<typeof comparisonManifestSchema>;
export type PinnedRun = z.infer<typeof selectionSchema> & { body: z.infer<typeof runBodyV2Schema> };
type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
const stable = (value: Json): string => Array.isArray(value) ? `[${value.map(stable).join(',')}]` : value !== null && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}` : JSON.stringify(value);
function leaves(value: Json, path: string, result: Map<string, Json>) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value) && 'status' in value && 'unit' in value) { result.set(path, value); return; }
  if (Array.isArray(value)) {
    if (!value.length) result.set(path, []);
    value.forEach((row, index) => {
      const identity = row !== null && typeof row === 'object' && !Array.isArray(row) ? row.id ?? row.productId ?? row.date : null;
      leaves(row, `${path}[${identity ?? index}]`, result);
    });
  } else if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value).sort()) leaves(value[key], path ? `${path}.${key}` : key, result);
  } else result.set(path, value);
}
function numericEvidence(value: Json): string {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'unit' in value && 'status' in value && value.status !== 'missing') return stable({ value: value.value, unit: value.unit, period: value.period });
  return stable(value);
}
export interface ComparisonDifference { path: string; kind: 'added' | 'removed' | 'changed' | 'provenance'; values: (Json | null)[] }
interface MetricValue { value: string | null; unit: string; period: string; basis: string; qualified: boolean }
export interface ComparisonMetric { id: string; label: string; values: MetricValue[]; comparable: boolean; delta: string | null }

/** Derived only from exact saved runs; the manifest never duplicates calculations. */
export function projectComparison(runs: PinnedRun[]) {
  const maps = runs.map(run => { const map = new Map<string, Json>(); leaves(JSON.parse(JSON.stringify(run.body.input)), '', map); return map; });
  const differences: ComparisonDifference[] = [];
  for (const path of [...new Set(maps.flatMap(map => [...map.keys()]))].sort()) {
    const present = maps.map(map => map.has(path)); const values = maps.map(map => map.get(path) ?? null);
    if (present.every(Boolean) && values.every(value => stable(value) === stable(values[0]))) continue;
    const kind = !present[0] ? 'added' : present.slice(1).some(value => !value) ? 'removed' : values.every(value => numericEvidence(value) === numericEvidence(values[0])) ? 'provenance' : 'changed';
    differences.push({ path, kind, values });
  }
  const weekKeys = { revenue: 'Przychód', variableCost: 'Koszt zmienny', contribution: 'Wkład kontrybucyjny', fixedCost: 'Koszty stałe', operatingRemainder: 'Wynik operacyjny', cashSurplus: 'Nadwyżka gotówkowa' } as const;
  const metrics: ComparisonMetric[] = Object.entries(weekKeys).map(([id, label]) => {
    const values = runs.map(({ body }) => {
      const economics = body.output.economics;
      return { value: economics[id as keyof typeof weekKeys], unit: 'PLN', period: `${economics.period}: ${body.input.input.interval.start} – ${body.input.input.interval.end}`, basis: economics.taxBasis, qualified: economics[id as keyof typeof weekKeys] !== null };
    });
    return metric(id, label, values);
  });
  for (const [id, label] of Object.entries({ revenue: 'Przychód miesiąca', operating: 'Wynik operacyjny miesiąca', ownerNet: 'Dochód netto właściciela', recurringCash: 'Powtarzalna gotówka po dochodzie właściciela' })) {
    metrics.push(metric(`monthly.${id}`, label, runs.map(({ body }) => {
      const monthly = body.output.monthly; const row = monthly?.[id as 'revenue' | 'operating' | 'ownerNet' | 'recurringCash'];
      return { value: row?.value ?? null, unit: row?.unit ?? 'PLN', period: row?.period ?? 'brak miesiąca', basis: `${row?.basis ?? 'brak podstawy'} / ${body.input.input.month?.taxBasis ?? 'brak'}`, qualified: row?.status === 'qualified' };
    })));
  }
  return { differences, metrics, variants: runs.map(run => ({ ...run, labor: run.body.input.input.resources.filter(resource => resource.kind === 'role').map(resource => ({ id: resource.id, name: resource.name, availableHours: Object.hasOwn(run.body.output.process.availablePersonMinutes, resource.id) ? run.body.output.process.availablePersonMinutes[resource.id] / 60 : null, requiredHours: (run.body.output.process.laborMinutes[resource.id] ?? 0) / 60 })) })) };
}
function metric(id: string, label: string, values: MetricValue[]): ComparisonMetric {
  const comparable = values.length >= 2 && values.every(row => row.qualified && row.value !== null && row.unit === values[0].unit && row.period === values[0].period && row.basis === values[0].basis);
  return { id, label, values, comparable, delta: comparable && values.length === 2 ? money(subtract(decimal(values[1].value!), decimal(values[0].value!))) : null };
}
