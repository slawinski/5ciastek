import { z } from 'zod';
import { conversionSchema, decimalSchema, evidenceSchema, instantSchema, intervalSchema, keySchema, quantitySchema, textSchema } from '../investment-scenarios/values';

export const resourceSchema = z.strictObject({ id: keySchema, name: textSchema, kind: z.enum(['role', 'equipment']),
  capacity: evidenceSchema, unit: z.enum(['person', 'g', 'piece']), availability: z.array(intervalSchema).max(200),
  daysPerWeek: z.number().int().min(1).max(7).optional(), hoursPerDay: z.number().min(0).max(24).optional(), cost: evidenceSchema,
});
const contextSchema = z.strictObject({ publicationId: z.number().int().positive(), batch: quantitySchema, staff: z.number().int().nonnegative(), machine: keySchema, conditions: textSchema });
export const operationSchema = z.strictObject({
  id: keySchema, productId: keySchema, step: z.number().int().nonnegative(), name: textSchema,
  kind: z.enum(['active', 'passive', 'auxiliary']), requestedStart: instantSchema, readyBy: instantSchema,
  priority: z.number().int().nonnegative(), duration: evidenceSchema,
  context: contextSchema, observationContext: contextSchema.optional(),
  predecessors: z.array(keySchema).max(200), phase: z.strictObject({ id: keySchema, offsetMinutes: decimalSchema }).optional(),
  demands: z.array(z.strictObject({ resourceId: keySchema, amount: evidenceSchema, unit: z.enum(['person', 'g', 'piece']), conversion: conversionSchema.optional(), offsetMinutes: decimalSchema, duration: evidenceSchema })).max(200),
  waitWindow: evidenceSchema,
});
export type Operation = z.infer<typeof operationSchema>;
export type Resource = z.infer<typeof resourceSchema>;
