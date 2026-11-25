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

it.each([['1', '1', '1'], ['1', '1', '4']])('allocates flour display shares to exactly 100%% for %j', (...masses) => {
  const base = freezeRecipe({ name: 'Podział', yield: 3, standalone: true, description: 'Test', process: [{ instruction: 'Test' }], ingredients: masses.map((mass, index) => ({ mass, ingredient: { id: index + 1, name: `Mąka ${index}`, kind: 'flour', flourType: `Typ ${index}` } })) });
  const shares = scaleRecipe(base, 10).flours.map(row => row.percent);
  expect(shares).toEqual(masses[2] === '1' ? ['33.34', '33.33', '33.33'] : ['16.67', '16.67', '66.66']);
  for (const target of [10, 15, 20, 30]) {
    const result = scaleRecipe(base, target);
    expect(result.flours.map(row => row.percent)).toEqual(shares);
    expect(result.flours.reduce((sum, row) => sum + Math.round(Number(row.percent) * 100), 0)).toBe(10000);
  }
});

it('keeps fractional starter contributions exact until the final scaling boundary', () => {
  const base = freezeRecipe({ name: 'Ułamki', yield: 3, standalone: true, description: 'Test', process: [{ instruction: 'Test' }], ingredients: [
    { mass: '0.001', ingredient: { id: 1, name: 'Zakwas', kind: 'starter', composition: { waterGrams: '1', flours: [{ flourType: 'A', grams: '2' }] } } },
  ] });
  expect(scaleRecipe(base, 10).flourGrams).toBe('0.002');
  expect(scaleRecipe(base, 10).totalGrams).toBe('0.003');
  expect(scaleRecipe(base, 30).flourGrams).toBe('0.007');
  expect(scaleRecipe(base, 10).hydration).toBe('50');
  const ten = scaleRecipe(base, 10);
  scaleRecipe(base, 30);
  expect(scaleRecipe(base, 10)).toEqual(ten);
});

it('rounds the exact batch sum independently from half-thousandth ingredient rows', () => {
  const base = freezeRecipe({ name: 'Połowy', standalone: true, description: 'Test', process: [{ instruction: 'Test' }], yield: 2, ingredients: [1, 2, 3].map(id => ({ mass: '0.001', ingredient: { id, name: `Mąka ${id}`, kind: 'flour', flourType: 'A' } })) });
  const result = scaleRecipe(base, 1);
  expect(result.ingredients.map(row => row.grams)).toEqual(['0.001', '0.001', '0.001']);
  expect(result.totalGrams).toBe('0.002');
});

it('scales a nondivisible reference starter without intermediate rounding', () => {
  const base = freezeRecipe({ name: 'Zakwas 200%', yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Test' }], ingredients: [
    { mass: '1', ingredient: { id: 1, name: 'Zakwas', kind: 'starter', composition: { waterGrams: '2', flours: [{ flourType: 'A', grams: '1' }] } } },
  ] });
  const result = scaleRecipe(base, 3);
  expect(result.flourGrams).toBe('1.000');
  expect(result.flours).toEqual([{ name: 'A', grams: '1.000', percent: '100' }]);
  expect(result.hydration).toBe('200');
  expect(result.totalGrams).toBe('3.000');
});
