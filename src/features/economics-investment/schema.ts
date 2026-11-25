import { z } from 'zod';
import { decimalSchema, evidenceSchema, keySchema, textSchema } from '../investment-scenarios/values';

export const costSchema = z.strictObject({ id: keySchema, expenseId: keySchema, name: textSchema,
  category: z.enum(['ingredient', 'packaging', 'batch', 'energy', 'equipment', 'labor', 'rent', 'fixed', 'owner-value']),
  basis: z.enum(['product', 'variable', 'fixed', 'disclosure']), method: z.enum(['full-unit', 'component', 'pool']),
  productId: keySchema.optional(), ingredientId: z.number().int().positive().optional(),
  quantity: evidenceSchema, rate: evidenceSchema, taxBasis: z.enum(['gross', 'net']), period: keySchema,
  allocations: z.array(z.strictObject({ productId: keySchema, share: decimalSchema })).max(200),
});
export const requiredSalesSchema = z.strictObject({ budget: evidenceSchema, period: keySchema,
  mix: z.array(z.strictObject({ productId: keySchema, soldPieces: z.number().int().positive(), price: evidenceSchema, unitCost: evidenceSchema, lossPercent: evidenceSchema })).max(200),
});
export const financeSchema = z.strictObject({ period: keySchema, taxBasis: z.enum(['gross', 'net']), costs: z.array(costSchema).max(2000),
  requiredSales: requiredSalesSchema, cashReceipts: evidenceSchema, cashPayments: evidenceSchema, ownerCharges: evidenceSchema,
  ownerValue: evidenceSchema, bottleneckMinutes: evidenceSchema,
});
export type FinanceInput = z.infer<typeof financeSchema>;
