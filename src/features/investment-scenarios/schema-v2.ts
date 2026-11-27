import { z } from 'zod';
import { scenarioSchema, productSchema, publicationSnapshotSchema } from './schema';
import { operationSchema, resourceSchema } from '../process-execution/schema';
import { lotSchema, movementSchema } from '../stock-inventory/schema';
import { financeSchema } from '../economics-investment/schema';
import { decimalSchema, evidenceSchema, instantSchema, intervalSchema, keySchema, known, quantitySchema, textSchema } from './values';
import { add, compare, decimal } from '../economics-investment/money';

const money = evidenceSchema.refine(value => value.unit === 'PLN', 'Wymagana jednostka PLN.');
export const batchSchema = z.strictObject({ id: keySchema, productId: keySchema, target: z.number().int().positive().max(Number.MAX_SAFE_INTEGER), readyOperationId: keySchema });
export const weeklyOperationSchema = operationSchema.extend({ batchId: keySchema });
export const weeklyLotSchema = lotSchema.extend({ batchId: keySchema.optional() });
export const openingWipSchema = z.strictObject({ id: keySchema, batchId: keySchema, operationId: keySchema,
  startedAt: instantSchema, quantity: quantitySchema, evidence: evidenceSchema,
  priorLabor: evidenceSchema, priorCost: money,
  coverage: z.array(z.strictObject({ ingredientId: z.number().int().positive(), quantity: quantitySchema, evidence: evidenceSchema })).max(200),
});
export const transitionWindowSchema = z.strictObject({ id: keySchema, batchId: keySchema, operationId: keySchema, predecessorId: keySchema,
  useFromMinutes: decimalSchema, useUntilMinutes: evidenceSchema,
}).superRefine((value, ctx) => {
  if (value.useUntilMinutes.unit !== 'min') ctx.addIssue({ code: 'custom', path: ['useUntilMinutes'], message: 'Okno wymaga minut.' });
  if (value.useUntilMinutes.status !== 'missing' && Number(value.useFromMinutes) > Number(value.useUntilMinutes.value)) ctx.addIssue({ code: 'custom', path: ['useFromMinutes'], message: 'Sprzeczne granice okna.' });
});
export const preparationSchema = z.strictObject({ id: keySchema, expenseId: keySchema, itemId: keySchema, quantity: quantitySchema,
  readyAt: instantSchema, expiresAt: instantSchema, admitted: z.boolean(), evidence: evidenceSchema,
  materialCost: money, laborRate: evidenceSchema, operations: z.array(operationSchema).max(200), resources: z.array(resourceSchema).max(200),
  coveredMovementIds: z.array(keySchema).max(5000),
}).superRefine((value, ctx) => {
  const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });
  // V2 preparation obeys the same process invariants without changing the frozen v1 reader.
  for (const field of ['operations', 'resources'] as const) {
    const ids = new Set<string>();
    value[field].forEach((row, index) => { if (ids.has(row.id)) issue([field, index, 'id'], 'Powtórzony identyfikator.'); ids.add(row.id); });
  }
  const operations = new Map(value.operations.map(row => [row.id, row]));
  const resources = new Map(value.resources.map(row => [row.id, row]));
  const visiting = new Set<string>(); const visited = new Set<string>();
  function visit(id: string): boolean {
    if (visiting.has(id)) return false;
    if (visited.has(id)) return true;
    const operation = operations.get(id); if (!operation) return false;
    visiting.add(id);
    for (const dependency of [...operation.predecessors, ...(operation.phase ? [operation.phase.id] : [])]) if (!visit(dependency)) return false;
    visiting.delete(id); visited.add(id); return true;
  }
  value.resources.forEach((resource, index) => {
    const capacity = known(resource.capacity);
    if (resource.capacity.unit !== resource.unit) issue(['resources', index, 'capacity'], 'Niezgodna jednostka pojemności.');
    if (resource.kind === 'role' && (resource.unit !== 'person' || (capacity !== null && !/^\d+$/.test(capacity)))) issue(['resources', index, 'capacity'], 'Obsada musi być całkowitą liczbą osób.');
    const intervals = [...resource.availability].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    if (intervals.some((interval, i) => i > 0 && Date.parse(interval.start) < Date.parse(intervals[i - 1].end))) issue(['resources', index, 'availability'], 'Przedziały dostępności nakładają się.');
  });
  value.operations.forEach((operation, index) => {
    if (!visit(operation.id)) issue(['operations', index, 'predecessors'], 'Brak poprzednika lub cykl zależności.');
    if (operation.duration.unit !== 'min' || operation.waitWindow.unit !== 'min') issue(['operations', index], 'Czas wymaga minut.');
    if (operation.duration.status === 'measured' && operation.observationContext && JSON.stringify(operation.context) !== JSON.stringify(operation.observationContext)) issue(['operations', index, 'duration'], 'Zmiana kontekstu wymaga estymacji lub braku czasu.');
    if (operation.duration.status === 'estimated' && operation.observationContext && !operation.duration.observationRef) issue(['operations', index, 'duration'], 'Wskaż oryginalny pomiar.');
    operation.demands.forEach((demand, demandIndex) => {
      const path = ['operations', index, 'demands', demandIndex]; const resource = resources.get(demand.resourceId);
      if (!resource) issue(path, 'Nieznany zasób.');
      const amount = known(demand.amount); const duration = known(operation.duration); const segment = known(demand.duration);
      if (resource?.kind === 'role' && (demand.unit !== 'person' || (amount !== null && !/^\d+$/.test(amount)))) issue(path, 'Obsada musi być całkowitą liczbą osób.');
      if (demand.amount.unit !== demand.unit || demand.duration.unit !== 'min') issue(path, 'Niezgodna jednostka zapotrzebowania lub czasu.');
      if (duration !== null && segment !== null && compare(add(decimal(demand.offsetMinutes), decimal(segment)), decimal(duration)) > 0n) issue(path, 'Odcinek wykracza poza operację.');
    });
    if (operation.duration.status === 'measured') {
      const equipment = operation.demands.filter(demand => resources.get(demand.resourceId)?.kind === 'equipment');
      if (equipment.some(demand => demand.resourceId !== operation.context.machine)) issue(['operations', index, 'context', 'machine'], 'Pomiar innego urządzenia wymaga jawnej estymacji.');
      const labor = operation.demands.filter(demand => resources.get(demand.resourceId)?.kind === 'role');
      const segments = labor.flatMap(demand => {
        const amount = known(demand.amount); const duration = known(demand.duration);
        if (demand.unit !== 'person' || amount === null || !/^\d+$/.test(amount) || duration === null) return [];
        const start = decimal(demand.offsetMinutes); return [{ start, end: add(start, decimal(duration)), amount: BigInt(amount) }];
      });
      const staff = segments.reduce((peak, segment) => {
        const concurrent = segments.reduce((sum, other) => compare(other.start, segment.start) <= 0n && compare(other.end, segment.start) > 0n ? sum + other.amount : sum, 0n);
        return concurrent > peak ? concurrent : peak;
      }, 0n);
      if (segments.length !== labor.length || staff !== BigInt(operation.context.staff)) issue(['operations', index, 'context', 'staff'], 'Obsada pomiaru nie odpowiada zapotrzebowaniu ról.');
    }
  });
});
export const monthSchema = z.strictObject({ period: z.string().regex(/^\d{4}-\d{2}$/), taxBasis: z.enum(['gross', 'net']),
  calendar: z.array(z.strictObject({ date: z.string().date(), productionProfile: z.string().date().nullable(), salesProfile: z.string().date().nullable(), evidence: evidenceSchema })).min(1).max(31),
  openingLots: z.array(lotSchema).max(2000), preparations: z.array(preparationSchema).max(2000),
  fixedCosts: z.array(z.strictObject({ id: keySchema, expenseId: keySchema, category: z.enum(['rent', 'seller', 'other']), amount: money })).max(2000),
  cashEntries: z.array(z.strictObject({ id: keySchema, expenseId: keySchema, kind: z.enum(['receipt', 'payment', 'inventory-change', 'other-in', 'other-out']), amount: money, includedExpenseIds: z.array(keySchema).max(2000) })).max(2000),
  ownerCharges: money, ownerIncome: money, ownerEconomicValue: money,
});
export const investmentSchema = z.strictObject({ equipment: money, premises: money, deposit: money, initialStock: money });
export const scenarioV2Schema = z.strictObject({ schemaVersion: z.literal(2), name: textSchema, period: keySchema, interval: intervalSchema,
  products: z.array(productSchema.omit({ target: true, readyOperationId: true })).min(1).max(200),
  batches: z.array(batchSchema).min(1).max(2000), operations: z.array(weeklyOperationSchema).max(2000), resources: z.array(resourceSchema).max(200),
  lots: z.array(weeklyLotSchema).max(2000), movements: z.array(movementSchema).max(5000), finance: financeSchema,
  openingWip: z.array(openingWipSchema).max(2000), windows: z.array(transitionWindowSchema).max(2000), month: monthSchema.nullable(), investment: investmentSchema,
}).superRefine((input, ctx) => {
  const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });
  for (const field of ['products', 'batches', 'operations', 'resources', 'lots', 'openingWip', 'windows'] as const) {
    const ids = new Set<string>(); input[field].forEach((row, index) => { if (ids.has(row.id)) issue([field, index, 'id'], 'Powtórzona tożsamość.'); ids.add(row.id); });
  }
  const batches = new Map(input.batches.map(batch => [batch.id, batch]));
  const operations = new Map(input.operations.map(operation => [operation.id, operation]));
  input.operations.forEach((operation, index) => {
    if (batches.get(operation.batchId)?.productId !== operation.productId) issue(['operations', index, 'batchId'], 'Operacja wymaga partii właściwego produktu.');
    for (const id of operation.predecessors) if (operations.get(id)?.batchId !== operation.batchId) issue(['operations', index, 'predecessors'], 'Poprzednik dotyczy innej partii.');
  });
  input.lots.forEach((lot, index) => {
    if (lot.readyOperationId && (!lot.batchId || operations.get(lot.readyOperationId)?.batchId !== lot.batchId || batches.get(lot.batchId)?.productId !== lot.productId)) issue(['lots', index, 'batchId'], 'Gotowy wyrób wymaga operacji tej samej partii.');
  });
  input.batches.forEach((batch, index) => {
    const product = input.products.find(row => row.id === batch.productId);
    if (!product) { issue(['batches', index, 'productId'], 'Nieznany produkt.'); return; }
    const selectedOperations = input.operations.filter(row => row.batchId === batch.id);
    const selectedLots = input.lots.filter(row => row.batchId === batch.id || !row.batchId);
    // Reuse the frozen input rules at the batch scale, never at an aggregate product target.
    const validation = scenarioSchema.safeParse({ schemaVersion: 1, name: input.name, period: input.period, interval: input.interval,
      products: [{ ...product, target: batch.target, readyOperationId: batch.readyOperationId }],
      operations: selectedOperations.map(({ batchId: _batchId, ...operation }) => operation), resources: input.resources,
      lots: selectedLots.map(({ batchId: _batchId, ...lot }) => lot), movements: [],
      finance: { ...input.finance, costs: input.finance.costs.filter(cost => !cost.productId || cost.productId === product.id), requiredSales: { ...input.finance.requiredSales, mix: input.finance.requiredSales.mix.filter(row => row.productId === product.id) } },
    });
    if (!validation.success) for (const error of validation.error.issues) issue(['batches', index, ...error.path.map(part => typeof part === 'number' ? part : String(part))], error.message);
    const ready = selectedLots.filter(lot => lot.batchId === batch.id && lot.readyOperationId && lot.quantity?.unit === 'piece').reduce((sum, lot) => sum + BigInt(lot.quantity!.value), 0n);
    if (ready !== BigInt(batch.target)) issue(['batches', index, 'target'], 'Suma wyrobów gotowych musi odpowiadać wielkości partii.');
  });
  input.openingWip.forEach((wip, index) => {
    if (operations.get(wip.operationId)?.batchId !== wip.batchId) issue(['openingWip', index, 'operationId'], 'Nieznany etap WIP.');
    if (Date.parse(wip.startedAt) >= Date.parse(input.interval.start)) issue(['openingWip', index, 'startedAt'], 'WIP otwarcia rozpoczyna się przed okresem.');
    if (wip.priorLabor.unit !== 'person-min') issue(['openingWip', index, 'priorLabor'], 'Wymagane osobominuty.');
    if (new Set(wip.coverage.map(row => row.ingredientId)).size !== wip.coverage.length) issue(['openingWip', index, 'coverage'], 'Powtórzony składnik pokrycia.');
  });
  input.windows.forEach((window, index) => {
    const operation = operations.get(window.operationId);
    if (operation?.batchId !== window.batchId || !operation.predecessors.includes(window.predecessorId)) issue(['windows', index, 'predecessorId'], 'Okno wymaga właściwego poprzednika tej partii.');
    const peers = input.windows.filter(row => row.operationId === window.operationId && row.predecessorId === window.predecessorId && row.useUntilMinutes.status !== 'missing');
    const lower = Math.max(...peers.map(row => Number(row.useFromMinutes)));
    const upper = Math.min(...peers.map(row => row.useUntilMinutes.status === 'missing' ? Infinity : Number(row.useUntilMinutes.value)));
    if (lower > upper) issue(['windows', index], 'Okna nie mają wspólnego przedziału użycia.');
  });
  const lotIds = new Set(input.lots.map(lot => lot.id)); const movementIds = new Map<string, string>();
  input.movements.forEach((movement, index) => {
    if (!lotIds.has(movement.lotId)) issue(['movements', index, 'lotId'], 'Nieznana partia.');
    if (movement.id.startsWith('recipe:')) issue(['movements', index, 'id'], 'Tożsamość zarezerwowana dla receptury.');
    const previous = movementIds.get(movement.id); if (previous && previous !== JSON.stringify(movement)) issue(['movements', index, 'id'], 'Sprzeczna treść ruchu.');
    movementIds.set(movement.id, JSON.stringify(movement));
    if (Date.parse(movement.at) < Date.parse(input.interval.start) || Date.parse(movement.at) >= Date.parse(input.interval.end)) issue(['movements', index, 'at'], 'Ruch poza okresem.');
  });
  if (input.month) {
    const month = input.month;
    if (new Set(month.calendar.map(row => row.date)).size !== month.calendar.length) issue(['month', 'calendar'], 'Powtórzona data kalendarza.');
    month.calendar.forEach((row, index) => {
      if (!row.date.startsWith(month.period)) issue(['month', 'calendar', index, 'date'], 'Data spoza miesiąca.');
      for (const key of ['productionProfile', 'salesProfile'] as const) if (row[key] && (row[key] < input.interval.start.slice(0, 10) || row[key] >= input.interval.end.slice(0, 10))) issue(['month', 'calendar', index, key], 'Profil spoza tygodnia.');
    });
    for (const field of ['preparations', 'fixedCosts', 'cashEntries'] as const) if (new Set(month[field].map(row => row.id)).size !== month[field].length) issue(['month', field], 'Powtórzona tożsamość uzgodnienia.');
  }
});
export const savedInputV2Schema = z.strictObject({ input: scenarioV2Schema, publications: z.array(publicationSnapshotSchema) });
export type ScenarioV2Input = z.infer<typeof scenarioV2Schema>;
export type SavedInputV2 = z.infer<typeof savedInputV2Schema>;
