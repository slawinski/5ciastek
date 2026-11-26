import { z } from 'zod';
import { scenarioSchema, savedInputSchema, type SavedInput } from './schema';
import { reportSchema, runBodySchema } from './report-schema';
import { scenarioV2Schema, savedInputV2Schema, type SavedInputV2 } from './schema-v2';

export const versionedScenarioSchema = z.union([scenarioSchema, scenarioV2Schema]);
export const versionedSavedInputSchema = z.union([savedInputSchema, savedInputV2Schema]);
export const reportV2Schema = reportSchema.extend({ engineVersion: z.literal('investment-scenario/2') });
export const runBodyV2Schema = z.strictObject({ input: savedInputV2Schema, output: reportV2Schema });
export const versionedRunBodySchema = z.union([runBodySchema, runBodyV2Schema]);

export function economicInput(saved: SavedInputV2): SavedInput {
  return { publications: saved.publications, input: { ...saved.input, schemaVersion: 1,
    products: saved.input.products.map(product => ({ ...product,
      target: saved.input.batches.filter(batch => batch.productId === product.id).reduce((total, batch) => total + batch.target, 0),
      readyOperationId: saved.input.batches.find(batch => batch.productId === product.id)!.readyOperationId,
    })),
  } };
}
