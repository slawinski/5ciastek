import { expect, it } from 'vitest';
import { evaluateScenario } from './evaluate';
import { at, scenarioFixture, sourced } from '@/tests/fixtures/investment-scenarios';
import { freezeRecipe } from '../recipes/publication';
import { reportSchema } from './report-schema';

it('joins saved publications, constrained chronology, supported sales and economics', () => {
  const input = scenarioFixture();
  const publications = input.products.map(product => ({ productId: product.id, publicationId: product.publicationId, versionKey: `${product.id}:1`, snapshot: freezeRecipe({ name: product.id, yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '500' }] }) }));
  const result = evaluateScenario({ input, publications });
  expect(result.process.operations.find(operation => operation.id === 'bake-B')?.waitingMinutes).toBe(15);
  expect(result.process.laborMinutes.baker).toBe(30);
  expect(result.economics).toMatchObject({ revenue: '460.00', variableCost: '224.00', contribution: '236.00', operatingRemainder: '56.00', cashSurplus: null });
  expect(result.economics.qualifications.map(reason => reason.identity)).toContain('ownerNet');
  expect(evaluateScenario({ input, publications })).toEqual(result);
  expect(reportSchema.parse(JSON.parse(JSON.stringify(result)))).toEqual(result);
  expect(reportSchema.safeParse({ ...result, economics: { ...result.economics, operatingRemainder: 'niepotwierdzona liczba' } }).success).toBe(false);
  input.lots.push({ id: 'flour', itemId: '1', location: 'magazyn', kind: 'material', quantity: { value: '20000', unit: 'g' }, evidence: sourced('20000', 'g'), availableAt: at('00:00'), expiresAt: at('23:00'), admitted: true, admissionSource: 'Syntetyczne dopuszczenie', sourceParts: ['delivery'], preparationContext: 'Sourced opening stock' });
  const withMaterials = evaluateScenario({ input, publications });
  expect(withMaterials.stock.lots.find(lot => lot.id === 'flour')?.physical).toBe('4000');
  expect(reportSchema.parse(JSON.parse(JSON.stringify(withMaterials)))).toEqual(withMaterials);
});
