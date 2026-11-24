import { draftSchema, type DraftInput, type Snapshot } from './schema';
import { grams, ratio, roundGrams } from './precision';

export function freezeRecipe(input: DraftInput): Snapshot {
  const data = draftSchema.parse(input);
  const total = data.ingredients.reduce((sum, row) => sum + grams(row.mass), 0n);
  const portionGrams = roundGrams(ratio(total, BigInt(data.yield)));
  if (data.portionGrams && roundGrams(ratio(grams(data.portionGrams))) !== portionGrams) {
    throw new Error('Masa porcji nie jest zgodna z sumą składników / uzyskiem.');
  }
  return {
    name: data.name, code: data.code, yield: data.yield, description: data.description,
    process: data.process, totalGrams: roundGrams(ratio(total)), portionGrams, unit: 'g',
    ingredients: data.ingredients.map(({ ingredient: { id, ...ingredient }, mass }) => ({ ...ingredient, ingredientId: id, mass })),
  };
}
