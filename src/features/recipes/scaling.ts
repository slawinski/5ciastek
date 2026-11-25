import { z } from 'zod';
import { snapshotSchema, type Snapshot } from './schema';
import { add, grams, multiply, percent, ratio, roundGrams, type Rational } from './precision';

function flourShares(types: Map<string, Rational>, total: Rational) {
  const shares = [...types].map(([name, mass], index) => {
    const numerator = mass.numerator * total.denominator * 10000n;
    const denominator = mass.denominator * total.numerator;
    return { name, index, units: numerator / denominator, remainder: numerator % denominator, denominator };
  });
  const remaining = 10000n - shares.reduce((sum, share) => sum + share.units, 0n);
  // Largest exact remainder wins; input order breaks ties without changing calculation inputs.
  const ranked = [...shares].sort((a, b) => {
    const difference = b.remainder * a.denominator - a.remainder * b.denominator;
    return difference > 0n ? 1 : difference < 0n ? -1 : a.index - b.index;
  });
  for (let index = 0; index < Number(remaining); index++) ranked[index].units++;
  return new Map(shares.map(share => [share.name, (Number(share.units) / 100).toString()]));
}

export function scaleRecipe(input: Snapshot, target: number) {
  const base = snapshotSchema.parse(input);
  z.number().int().positive().safe().parse(target);
  const n = BigInt(base.yield), t = BigInt(target);
  let flour = ratio(0n), water = ratio(0n);
  const types = new Map<string, Rational>();
  const missing: string[] = [];
  const addFlour = (name: string, mass: Rational) => {
    flour = add(flour, mass);
    types.set(name, add(types.get(name) ?? ratio(0n), mass));
  };
  for (const row of base.ingredients) {
    const mass = ratio(grams(row.mass));
    if (row.kind === 'flour') {
      if (row.flourType) addFlour(row.flourType, mass);
      else missing.push(`${row.name}: brak rodzaju mąki`);
    } else if (row.kind === 'water') water = add(water, mass);
    else if (row.kind === 'unknown') missing.push(`${row.name}: brak klasyfikacji`);
    else if (row.kind === 'starter') {
      if (!row.composition) { missing.push(`${row.name}: brak kompozycji mąki i wody`); continue; }
      const total = grams(row.composition.waterGrams) + row.composition.flours.reduce((sum, item) => sum + grams(item.grams), 0n);
      water = add(water, multiply(mass, grams(row.composition.waterGrams), total));
      for (const item of row.composition.flours) addFlour(item.flourType, multiply(mass, grams(item.grams), total));
    }
  }
  if (!flour.numerator) missing.push('Brak poprawnej podstawy mąki.');
  const complete = missing.length === 0;
  const shares = complete ? flourShares(types, flour) : new Map<string, string>();
  const total = base.ingredients.reduce((sum, row) => sum + grams(row.mass), 0n);
  return {
    target, portionGrams: roundGrams(ratio(total, n)), totalGrams: roundGrams(ratio(total * t, n)), missing,
    flourGrams: complete ? roundGrams(multiply(flour, t, n)) : null,
    hydration: complete ? percent(water, flour) : null,
    flours: complete ? [...types].map(([name, mass]) => ({ name, grams: roundGrams(multiply(mass, t, n)), percent: shares.get(name)! })) : [],
    ingredients: base.ingredients.map(row => ({ ...row, grams: roundGrams(ratio(grams(row.mass) * t, n)), percent: complete ? percent(ratio(grams(row.mass)), flour) : null })),
  };
}
