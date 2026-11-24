import { expect, it } from 'vitest';
import { freezeRecipe } from './publication';
import { scaleRecipe } from './scaling';

const snapshot = freezeRecipe({ name: 'Baza', yield: 5, standalone: true, description: 'Test', process: [{ instruction: 'Mieszanie' }], ingredients: [
  { ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '2000' },
  { ingredient: { id: 2, name: 'Woda', kind: 'water' }, mass: '1560' },
  { ingredient: { id: 3, name: 'Sól', kind: 'salt' }, mass: '40' },
  { ingredient: { id: 4, name: 'Dodatek', kind: 'other' }, mass: '400' },
] });

it('scales all presets from base and returns identically after 10→30→10', () => {
  for (const [target, total] of [[10, '8000.000'], [15, '12000.000'], [20, '16000.000'], [30, '24000.000']] as const) {
    const result = scaleRecipe(snapshot, target);
    expect(result.totalGrams).toBe(total);
    expect(result.ingredients.map(row => row.percent)).toEqual(['100', '78', '2', '20']);
  }
  const ten = scaleRecipe(snapshot, 10);
  scaleRecipe(snapshot, 30);
  expect(scaleRecipe(snapshot, 10)).toEqual(ten);
  expect(ten.ingredients[1].grams).toBe('3120.000');
});

it('counts starter flour and water exactly once and reports missing composition', () => {
  const recipe = { name: 'Zakwas', yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Test' }], ingredients: [
    { ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '2000' },
    { ingredient: { id: 2, name: 'Zakwas', kind: 'starter', composition: { waterGrams: '500', flours: [{ flourType: 'żytnia', grams: '500' }] } }, mass: '1000' },
  ] };
  const result = scaleRecipe(freezeRecipe(recipe), 1);
  expect(result.totalGrams).toBe('3000.000');
  expect(result.flourGrams).toBe('2500.000');
  expect(result.hydration).toBe('20');
  expect(result.ingredients).toHaveLength(2);
  expect(result.flours.map(row => row.percent)).toEqual(['80', '20']);
  delete recipe.ingredients[1].ingredient.composition;
  const missing = scaleRecipe(freezeRecipe(recipe), 1);
  expect(missing.flourGrams).toBeNull();
  expect(missing.ingredients[1].grams).toBe('1000.000');
  expect(missing.ingredients[0].percent).toBeNull();
});
