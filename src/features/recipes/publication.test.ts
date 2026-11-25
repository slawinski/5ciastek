import { describe, expect, it } from 'vitest';
import { freezeRecipe } from './publication';

const flour = { id: 1, name: 'Mąka pszenna', kind: 'flour', flourType: 'pszenna' };
const water = { id: 2, name: 'Woda', kind: 'water' };
const base = { name: 'Chleb', yield: 5, standalone: true, description: 'Pełna receptura', process: [{ instruction: 'Mieszanie' }], ingredients: [{ ingredient: flour, mass: '2500' }, { ingredient: water, mass: '1500' }] };

describe('recipe publication contract', () => {
  it('freezes exact masses and source values without retaining mutable references', () => {
    const draft = structuredClone(base);
    const snapshot = freezeRecipe(draft);
    draft.ingredients[0].ingredient.name = 'Nowa nazwa';
    expect(snapshot.ingredients[0].name).toBe('Mąka pszenna');
    expect(snapshot.totalGrams).toBe('4000.000');
    expect(snapshot.portionGrams).toBe('800.000');
  });
  it('rejects inconsistent portion, additions-only variants and invalid yield/mass', () => {
    for (const change of [{ portionGrams: '750' }, { standalone: false }, { yield: 0 }, { yield: 1.5 }, { ingredients: [{ ingredient: flour, mass: '1.0001' }] }]) {
      expect(() => freezeRecipe({ ...base, ...change })).toThrow();
    }
  });
  it('uses the approved rounded comparison without another tolerance', () => {
    const draft = { ...base, yield: 3, ingredients: [{ ingredient: flour, mass: '1' }] };
    expect(freezeRecipe({ ...draft, portionGrams: '0.333' }).portionGrams).toBe('0.333');
    expect(() => freezeRecipe({ ...draft, portionGrams: '0.334' })).toThrow();
  });
  it('treats only the exact empty optional portion as absent, without relaxing masses', () => {
    expect(freezeRecipe({ ...base, portionGrams: '' }).portionGrams).toBe('800.000');
    for (const portionGrams of [' ', '0', '800.0001', '750']) expect(() => freezeRecipe({ ...base, portionGrams })).toThrow();
    expect(() => freezeRecipe({ ...base, ingredients: [{ ingredient: flour, mass: '' }] })).toThrow();
  });
});
