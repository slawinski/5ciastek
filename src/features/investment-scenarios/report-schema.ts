import { z } from 'zod';
import { snapshotSchema } from '../recipes/schema';
import { movementSchema } from '../stock-inventory/schema';
import { instantSchema } from './values';
import { savedInputSchema } from './schema';

const number = z.string().regex(/^-?\d+(?:\.\d+)?$/);
const optionalNumber = number.nullable();
const quantities = z.record(z.string(), number);
const minutes = z.number().nonnegative();
const qualifications = z.array(z.strictObject({ domain: z.enum(['people', 'machines', 'technology', 'materials', 'finance']), identity: z.string(), reason: z.string() }));
export const reportSchema = z.strictObject({
  engineVersion: z.literal('investment-scenario/1'),
  process: z.strictObject({
    interval: z.strictObject({ start: instantSchema, end: instantSchema, zone: z.string().optional() }),
    operations: z.array(z.strictObject({ id: z.string(), productId: z.string(), readyBy: instantSchema, start: instantSchema.nullable(), end: instantSchema.nullable(), elapsedMinutes: minutes.nullable(), waitingMinutes: minutes.nullable(), waitingFor: z.array(z.string()), deadlineMissed: z.boolean().nullable(), minutesInside: minutes.nullable(), minutesBefore: minutes.nullable() })),
    reservations: z.array(z.strictObject({ resourceId: z.string(), operationId: z.string(), start: z.number(), end: z.number(), amount: number })),
    laborMinutes: z.record(z.string(), minutes), availablePersonMinutes: z.record(z.string(), minutes), qualifications,
  }),
  stock: z.strictObject({
    lots: z.array(z.strictObject({ id: z.string(), itemId: z.string(), physical: optionalNumber, saleable: optionalNumber, unit: z.string().nullable(), sourceParts: z.array(z.string()), preparationContext: z.string() })),
    sales: quantities, readyPieces: quantities, unmet: z.array(z.strictObject({ movementId: z.string(), quantity: number, reason: z.string() })),
    movements: z.array(movementSchema), qualifications,
  }),
  economics: z.strictObject({
    rounding: z.string(), taxBasis: z.enum(['gross', 'net']), period: z.string(),
    revenue: optionalNumber, knownRevenue: number, productCost: optionalNumber, grossMargin: optionalNumber, variableCost: optionalNumber,
    contribution: optionalNumber, knownContribution: number, fixedCost: optionalNumber, operatingRemainder: optionalNumber, cashSurplus: optionalNumber,
    ownerEconomicValue: optionalNumber, actualTimeCost: z.null(), employmentCost: z.null(),
    contributionPerPiece: optionalNumber, contributionPerBatch: optionalNumber, contributionPerPersonHour: optionalNumber, contributionPerBottleneckMinute: optionalNumber,
    requiredSales: z.strictObject({ status: z.enum(['calculated', 'unverified', 'no-finite-solution']), sold: quantities, produced: quantities, revenue: optionalNumber, variableCost: optionalNumber, contribution: optionalNumber, period: z.string(), reason: z.string() }),
    comparison: z.record(z.string(), z.strictObject({ ready: optionalNumber, required: number, deficit: optionalNumber })),
    costs: z.array(z.strictObject({ id: z.string(), expenseId: z.string(), category: z.enum(['ingredient', 'packaging', 'batch', 'energy', 'equipment', 'labor', 'rent', 'fixed', 'owner-value']), basis: z.enum(['product', 'variable', 'fixed', 'disclosure']), amount: optionalNumber, allocations: z.array(z.strictObject({ productId: z.string(), quantity: optionalNumber, amount: optionalNumber })) })),
    qualifications,
  }),
  recipeRequirements: z.array(z.strictObject({ productId: z.string(), publicationId: z.number().int().positive(), versionKey: z.string(), scaled: z.strictObject({
    target: z.number().int().positive(), portionGrams: number, totalGrams: number, missing: z.array(z.string()), flourGrams: optionalNumber, hydration: optionalNumber,
    flours: z.array(z.strictObject({ name: z.string(), grams: number, percent: number })),
    ingredients: z.array(snapshotSchema.shape.ingredients.element.extend({ grams: number, percent: optionalNumber })),
  }) })),
});
export const runBodySchema = z.strictObject({ input: savedInputSchema, output: reportSchema });
