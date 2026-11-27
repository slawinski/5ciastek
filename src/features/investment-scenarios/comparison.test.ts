import { expect, it } from 'vitest';
import { comparisonManifestSchema, projectComparison, type PinnedRun } from './comparison';
import { weeklyFixture, sourced, missing } from './reference';
import { freezeRecipe } from '../recipes/publication';
import { evaluateScenarioV2 } from './evaluate-v2';
import { scenarioV2Schema } from './schema-v2';

function variant(id: number, hours: number): PinnedRun {
  const input = weeklyFixture();
  input.openingWip = [];
  input.resources[0].availability = Array.from({ length: hours === 40 ? 5 : 7 }, (_, day) => ({ zone: input.interval.zone, start: `2026-11-${23 + day}T00:00:00+01:00`, end: `2026-11-${23 + day}T${hours === 40 ? '08' : '12'}:00:00+01:00` }));
  if (id === 2) { input.products[0].price = sourced('22', 'PLN/piece'); input.products[0].lossPercent = sourced('5', '%'); input.resources[2].capacity = sourced('32', 'piece'); const prep = input.operations.find(row => row.id === 'prep-B')!; prep.duration = sourced('30', 'min'); prep.demands[0].duration = sourced('30', 'min'); }
  input.finance.costs.push({ ...input.finance.costs[0], id: 'rent', expenseId: 'rent', name: 'Najem', category: 'rent', rate: id === 2 ? missing('PLN/day', 'Brak najmu') : sourced('100', 'PLN/day') });
  const publications = input.products.map(product => ({ productId: product.id, publicationId: product.publicationId, versionKey: `${product.id}:1`, snapshot: freezeRecipe({ name: product.id, yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '500' }] }) }));
  const saved = { input, publications };
  return { runId: id, revisionId: id, revisionNumber: 1, scenarioKey: `variant-${id}`, fingerprint: 'a'.repeat(64), engineVersion: 'investment-scenario/2', body: { input: saved, output: evaluateScenarioV2(saved) } };
}

it('projects genuine 40h/84h runs, missing rent and changed price, loss and oven deterministically', () => {
  const a = variant(1, 40); const b = variant(2, 84);
  const result = projectComparison([a, b]);
  expect(result).toEqual(projectComparison([a, b]));
  expect(result.variants.map(row => row.labor.find(role => role.id === 'baker')?.availableHours)).toEqual([40, 84]);
  expect(result.variants[0].labor[0].requiredHours).not.toBe(40);
  expect(result.variants[0].labor[0].requiredHours).not.toBe(result.variants[1].labor[0].requiredHours);
  expect(result.differences.some(row => row.path.includes('price') && row.kind === 'changed')).toBe(true);
  expect(result.differences.some(row => row.path.includes('lossPercent'))).toBe(true);
  expect(result.differences.some(row => row.path.includes('oven') && row.path.includes('capacity'))).toBe(true);
  expect(result.differences.some(row => JSON.stringify(row.values).includes('Brak najmu'))).toBe(true);
  expect(b.body.output.economics.operatingRemainder).toBeNull();
});

it('preserves provenance-only differences and identity-based additions/removals, not array ordering', () => {
  const a = variant(1, 40); const b = variant(2, 40); b.body = structuredClone(a.body);
  b.body.input.input.products.reverse();
  const price = sourced('5', 'PLN/piece');
  if (price.status === 'missing') throw new Error('Expected sourced evidence');
  b.body.input.input.products[0].price = { ...price, source: 'Nowe źródło bez zmiany liczby' };
  const result = projectComparison([a, b]);
  expect(result.differences).toHaveLength(1);
  expect(result.differences[0]).toMatchObject({ kind: 'provenance', path: 'input.products[B].price' });
});

it('never subtracts unlike periods, units, tax or qualified bases', () => {
  const a = variant(1, 40); const b = variant(2, 84);
  b.body.output.economics.period = 'day';
  const result = projectComparison([a, b]);
  expect(result.metrics.find(row => row.id === 'revenue')).toMatchObject({ comparable: false, delta: null });
});

it('requires at least two distinct scenario identities and exact v2 run identities', () => {
  const a = variant(1, 40); const b = variant(2, 84);
  const selections = [a, b].map(({ body: _body, ...identity }) => identity);
  expect(comparisonManifestSchema.safeParse({ schemaVersion: 1, selections }).success).toBe(true);
  expect(comparisonManifestSchema.safeParse({ schemaVersion: 1, selections: [selections[0]] }).success).toBe(false);
  expect(comparisonManifestSchema.safeParse({ schemaVersion: 1, selections: [selections[0], { ...selections[1], scenarioKey: selections[0].scenarioKey }] }).success).toBe(false);
});
it('shows identity additions/removals and rejects non-PLN financial input', () => {
  const a = variant(1, 40); const b = variant(2, 84);
  b.body.input.input.resources.push({ ...b.body.input.input.resources[2], id: 'new-oven' });
  b.body.input.input.resources = b.body.input.input.resources.filter(row => row.id !== 'seller');
  const result = projectComparison([a, b]);
  expect(result.differences.some(row => row.path.includes('new-oven') && row.kind === 'added')).toBe(true);
  expect(result.differences.some(row => row.path.includes('seller') && row.kind === 'removed')).toBe(true);
  b.body.input.input.products[0].price = sourced('20', 'EUR/piece');
  expect(scenarioV2Schema.safeParse(b.body.input.input).success).toBe(false);
});
