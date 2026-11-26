import { savedInputV2Schema, type SavedInputV2 } from './schema-v2';
import { economicInput } from './versioned';
import { evaluateProcess } from '../process-execution/evaluate';
import { evaluateStock } from '../stock-inventory/evaluate';
import { evaluateEconomics } from '../economics-investment/evaluate';
import { scaleRecipe } from '../recipes/scaling';

export const ENGINE_V2 = 'investment-scenario/2' as const;
export function evaluateScenarioV2(raw: SavedInputV2) {
  const saved = savedInputV2Schema.parse(raw); const { input } = saved;
  const process = evaluateProcess(input.operations, input.resources, input.interval);
  const stock = evaluateStock(input.lots, input.movements, process);
  stock.qualifications.push({ domain: 'materials', identity: 'recipe-coverage', reason: 'Pokrycie recepturowe partii wymaga uzgodnienia.' });
  const economics = evaluateEconomics(economicInput(saved), stock, process);
  return { engineVersion: ENGINE_V2, process, stock, economics,
    recipeRequirements: input.batches.map(batch => {
      const publication = saved.publications.find(row => row.productId === batch.productId)!;
      return { productId: batch.productId, publicationId: publication.publicationId, versionKey: publication.versionKey, scaled: scaleRecipe(publication.snapshot, batch.target) };
    }),
  };
}
