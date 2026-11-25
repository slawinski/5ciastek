import { z } from 'zod';
import { grams } from './precision';

export const massSchema = z.string().max(40).refine(value => {
  try { grams(value); return true; } catch { return false; }
}, 'Podaj dodatnią masę w g z dokładnością do 0,001 g.');

export const compositionSchema = z.object({
  waterGrams: massSchema,
  flours: z.array(z.object({ flourType: z.string().trim().min(1), grams: massSchema })).min(1).max(100),
});
export const ingredientSchema = z.object({
  id: z.number().int().positive(), name: z.string().trim().min(1),
  kind: z.enum(['flour', 'water', 'salt', 'starter', 'other', 'unknown']),
  flourType: z.string().nullable().optional(), composition: compositionSchema.nullable().optional(),
});
export const draftSchema = z.object({
  name: z.string().trim().min(1).max(200), code: z.string().nullable().optional(),
  yield: z.number().int().positive(), standalone: z.literal(true, 'Wariant musi zawierać pełną samodzielną recepturę.'),
  portionGrams: z.preprocess(value => value === '' ? null : value, massSchema.nullable().optional()), description: z.string().trim().min(1).max(10000),
  process: z.array(z.object({ instruction: z.string().trim().min(1).max(10000) })).min(1).max(100),
  ingredients: z.array(z.object({ ingredient: ingredientSchema, mass: massSchema })).min(1).max(200),
});
export const snapshotSchema = draftSchema.omit({ standalone: true, portionGrams: true, ingredients: true }).extend({
  ingredients: z.array(ingredientSchema.omit({ id: true }).extend({ ingredientId: z.number(), mass: massSchema })),
  totalGrams: massSchema, portionGrams: z.string().regex(/^\d+\.\d{3}$/), unit: z.literal('g'),
});
export type Snapshot = z.infer<typeof snapshotSchema>;
export interface DraftInput {
  name: string; code?: string | null; yield: number; standalone: boolean; portionGrams?: string | null;
  description: string; process: { instruction: string }[];
  ingredients: { ingredient: { id: number; name: string; kind: string; flourType?: string | null; composition?: z.input<typeof compositionSchema> | null }; mass: string }[];
}
