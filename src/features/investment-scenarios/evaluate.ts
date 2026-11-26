import { savedInputSchema, type SavedInput } from './schema';
import { evaluateProcess } from '../process-execution/evaluate';
import { evaluateStock } from '../stock-inventory/evaluate';
import { evaluateEconomics } from '../economics-investment/evaluate';
import { scaleRecipe } from '../recipes/scaling';
import type { Movement } from '../stock-inventory/schema';
import { quantitySchema, type Qualification } from './values';

export const ENGINE_VERSION = 'investment-scenario/1';
export function evaluateScenario(raw: SavedInput) {
  const saved = savedInputSchema.parse(raw); const { input } = saved;
  const process = evaluateProcess(input.operations, input.resources, input.interval);
  const consumption: Movement[] = [];
  const materialQualifications: Qualification[] = [];
  const recipeRequirements = saved.publications.map(publication => {
    const product = input.products.find(product => product.id === publication.productId)!;
    const scaled = scaleRecipe(publication.snapshot, product.target);
    const first = process.operations.filter(operation => operation.productId === product.id && operation.start).sort((a, b) => Date.parse(a.start!) - Date.parse(b.start!))[0];
    for (const ingredient of scaled.ingredients) {
      const lot = input.lots.filter(lot => lot.kind === 'material' && lot.itemId === String(ingredient.ingredientId)).sort((a, b) => a.id.localeCompare(b.id))[0];
      if (!lot || !first?.start) materialQualifications.push({ domain: 'materials', identity: String(ingredient.ingredientId), reason: 'Brak źródłowego stanu surowca lub początku operacji do pokrycia zapotrzebowania recepturowego.' });
      else if (Number(ingredient.grams) > 0) consumption.push({ id: `recipe:${product.id}:${ingredient.ingredientId}`, lotId: lot.id, at: first.start, kind: 'consume', quantity: quantitySchema.parse({ value: ingredient.grams, unit: 'g' }), admitted: true,
        evidence: { status: 'estimated', value: ingredient.grams, unit: 'g', source: `Skalowanie publikacji ${publication.versionKey}`, date: input.interval.start.slice(0, 10), version: publication.versionKey, period: input.period, context: `Dokładne skalowanie bazowej receptury dla ${product.target} szt.` }, reason: 'Zużycie recepturowe liczone z zamrożonej bazy.' });
    }
    return { productId: product.id, publicationId: publication.publicationId, versionKey: publication.versionKey, scaled };
  });
  const stock = evaluateStock(input.lots, [...input.movements, ...consumption], process);
  stock.qualifications.push(...materialQualifications);
  for (const unmet of stock.unmet) stock.qualifications.push({ domain: 'materials', identity: unmet.movementId, reason: `${unmet.reason} Brak: ${unmet.quantity}.` });
  const economics = evaluateEconomics(saved, stock, process);
  return { engineVersion: ENGINE_VERSION, process, stock, economics, recipeRequirements };
}
export type ScenarioReport = ReturnType<typeof evaluateScenario>;
