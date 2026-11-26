import { z } from 'zod';
import { conversionSchema, evidenceSchema, instantSchema, keySchema, quantitySchema, textSchema } from '../investment-scenarios/values';

export const lotSchema = z.strictObject({ id: keySchema, itemId: keySchema, location: keySchema, kind: z.enum(['material', 'wip', 'finished']),
  quantity: quantitySchema.nullable(), evidence: evidenceSchema, availableAt: instantSchema, expiresAt: instantSchema.nullable(),
  admitted: z.boolean().nullable(), admissionSource: textSchema.nullable(), sourceParts: z.array(keySchema).min(1).max(200),
  readyOperationId: keySchema.optional(), productId: keySchema.optional(), preparationContext: textSchema,
});
export const movementSchema = z.strictObject({ id: keySchema, lotId: keySchema, targetLotId: keySchema.optional(), at: instantSchema,
  kind: z.enum(['delivery', 'consume', 'loss', 'sale', 'carry', 'waste', 'return', 'refund', 'transfer']),
  quantity: quantitySchema.refine(value => value.value !== '0', 'Ilość ruchu musi być dodatnia.'),
  evidence: evidenceSchema, reason: textSchema, admitted: z.boolean().nullable(),
  conversion: conversionSchema.optional(),
}).superRefine((movement, context) => {
  if (movement.kind === 'transfer') {
    if (!movement.targetLotId || movement.targetLotId === movement.lotId) context.addIssue({ code: 'custom', path: ['targetLotId'], message: 'Transfer wymaga odrębnej partii docelowej.' });
  } else if (movement.targetLotId !== undefined) context.addIssue({ code: 'custom', path: ['targetLotId'], message: 'Partia docelowa dotyczy wyłącznie transferu.' });
});
export type Lot = z.infer<typeof lotSchema>;
export type Movement = z.infer<typeof movementSchema>;
