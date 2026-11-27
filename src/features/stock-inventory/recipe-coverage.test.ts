import { expect, it } from 'vitest';
import { at, scenarioFixture, sourced } from '@/tests/fixtures/investment-scenarios';
import { freezeRecipe } from '../recipes/publication';
import { upgradeScenario } from '../investment-scenarios/upgrade';
import { evaluateScenarioV2 } from '../investment-scenarios/evaluate-v2';

it('allocates FEFO across lots and independently withholds material-unsupported sales', () => {
  const input = upgradeScenario(scenarioFixture());
  const publications = input.products.map(product => ({ productId: product.id, publicationId: product.publicationId, versionKey: `${product.id}:1`, snapshot: freezeRecipe({ name: product.id, yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '500' }] }) }));
  const material = { id: 'early', itemId: '1', location: 'magazyn', kind: 'material' as const, quantity: { value: '6000', unit: 'g' as const }, evidence: sourced('6000', 'g'), availableAt: at('00:00'), expiresAt: at('12:00'), admitted: true, admissionSource: 'Syntetyczne dopuszczenie', sourceParts: ['delivery'], preparationContext: 'Zapas otwarcia' };
  input.lots.push(material, { ...material, id: 'later', quantity: { value: '6000', unit: 'g' }, expiresAt: at('23:00') });
  const result = evaluateScenarioV2({ input, publications });
  expect(result.stock.movements.filter(row => row.id.startsWith('recipe:')).map(row => [row.lotId, row.quantity.value])).toEqual([['early', '6000'], ['later', '4000'], ['later', '2000']]);
  expect(result.stock.sales).toEqual({ A: '20' });
  expect(result.economics.revenue).toBe('400.00');
  expect(result.stock.boundaries.opening.find(row => row.id === 'early')?.physical).toBe('6000');
  expect(result.stock.boundaries.closing.find(row => row.id === 'later')?.physical).toBe('0');
  expect(result.stock.coverage.find(row => row.batchId === 'batch:B')?.status).toBe('unverified');
  input.openingWip.push({ id: 'opening', batchId: 'batch:A', operationId: 'prep-A', startedAt: '2026-11-24T23:45:00+01:00',
    quantity: { value: '10', unit: 'piece' }, evidence: sourced('10', 'piece'), priorLabor: sourced('10', 'person-min'), priorCost: sourced('20', 'PLN'),
    coverage: [{ ingredientId: 1, quantity: { value: '5000', unit: 'g' }, evidence: sourced('5000', 'g') }],
  });
  const embodied = evaluateScenarioV2({ input, publications });
  expect(embodied.stock.coverage.find(row => row.batchId === 'batch:A')).toMatchObject({ required: '10000', fromWip: '5000', allocated: '5000', missing: '0', status: 'verified' });
  expect(embodied.stock.sales).toEqual({ A: '20', B: '12' });
  expect(embodied.stock.movements.filter(row => row.id.startsWith('recipe:')).reduce((sum, row) => sum + Number(row.quantity.value), 0)).toBe(11000);
});

it('keeps same-lot carry available across the boundary without creating revenue', () => {
  const input = upgradeScenario(scenarioFixture());
  input.movements = [input.movements[0], { ...input.movements[1], kind: 'carry', quantity: { value: '12', unit: 'piece' } }];
  // No recipe material can be invented: this exercises an opening finished lot.
  input.lots[1].readyOperationId = undefined; input.lots[1].batchId = undefined;
  input.batches = input.batches.filter(row => row.productId === 'A');
  input.products = input.products.filter(row => row.id === 'A'); input.operations = input.operations.filter(row => row.productId === 'A'); input.windows = input.windows.filter(row => row.batchId === 'batch:A');
  input.lots[1].productId = undefined;
  input.lots[1].expiresAt = '2026-11-27T00:00:00+01:00';
  const publications = [{ productId: 'A', publicationId: 1, versionKey: 'A:1', snapshot: freezeRecipe({ name: 'A', yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '500' }] }) }];
  const result = evaluateScenarioV2({ input, publications });
  expect(result.stock.boundaries.closing.find(row => row.id === 'lot-B')).toMatchObject({ physical: '12', saleable: '12' });
  expect(result.stock.sales.B).toBeUndefined();
});
