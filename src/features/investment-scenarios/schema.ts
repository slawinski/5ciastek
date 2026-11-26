import { z } from 'zod';
import { operationSchema, resourceSchema } from '../process-execution/schema';
import { lotSchema, movementSchema } from '../stock-inventory/schema';
import { financeSchema } from '../economics-investment/schema';
import { add, compare, decimal } from '../economics-investment/money';
import { snapshotSchema } from '../recipes/schema';
import { decimalSchema, evidenceSchema, intervalSchema, keySchema, known, textSchema } from './values';

export const productSchema = z.strictObject({ id: keySchema, publicationId: z.number().int().positive(), target: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  price: evidenceSchema, unitCost: evidenceSchema, lossPercent: evidenceSchema, readyOperationId: keySchema,
});
export const scenarioSchema = z.strictObject({ schemaVersion: z.literal(1), name: textSchema, period: keySchema, interval: intervalSchema,
  products: z.array(productSchema).min(1).max(200), operations: z.array(operationSchema).max(2000), resources: z.array(resourceSchema).max(200),
  lots: z.array(lotSchema).max(2000), movements: z.array(movementSchema).max(5000), finance: financeSchema,
}).superRefine((value, ctx) => {
  const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });
  for (const field of ['products', 'operations', 'resources', 'lots'] as const) {
    const ids = new Set<string>();
    value[field].forEach((row, index) => { if (ids.has(row.id)) issue([field, index, 'id'], 'Powtórzony identyfikator.'); ids.add(row.id); });
  }
  const operations = new Map(value.operations.map(operation => [operation.id, operation]));
  const products = new Map(value.products.map(product => [product.id, product]));
  const resources = new Map(value.resources.map(resource => [resource.id, resource]));
  const lotIds = new Set(value.lots.map(lot => lot.id));
  const visiting = new Set<string>(); const visited = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return false;
    if (visited.has(id)) return true;
    const operation = operations.get(id); if (!operation) return false;
    visiting.add(id);
    for (const dependency of [...operation.predecessors, ...(operation.phase ? [operation.phase.id] : [])]) if (!visit(dependency)) return false;
    visiting.delete(id); visited.add(id); return true;
  };
  value.operations.forEach((operation, index) => {
    if (!visit(operation.id)) issue(['operations', index, 'predecessors'], 'Brak poprzednika lub cykl zależności.');
    if (!products.has(operation.productId)) issue(['operations', index, 'productId'], 'Nieznany produkt.');
    if (operation.context.publicationId !== products.get(operation.productId)?.publicationId) issue(['operations', index, 'context'], 'Kontekst dotyczy innej publikacji.');
    if (operation.duration.unit !== 'min' || operation.waitWindow.unit !== 'min') issue(['operations', index], 'Czas wymaga minut.');
    if (operation.duration.status === 'measured' && operation.observationContext && JSON.stringify(operation.context) !== JSON.stringify(operation.observationContext)) issue(['operations', index, 'duration'], 'Zmiana kontekstu wymaga estymacji lub braku czasu.');
    if (operation.duration.status === 'estimated' && operation.observationContext && !operation.duration.observationRef) issue(['operations', index, 'duration'], 'Wskaż oryginalny pomiar.');
    if (operation.duration.status === 'measured') {
      const equipment = operation.demands.filter(demand => resources.get(demand.resourceId)?.kind === 'equipment');
      if (equipment.some(demand => demand.resourceId !== operation.context.machine)) issue(['operations', index, 'context', 'machine'], 'Pomiar innego urządzenia wymaga jawnej estymacji.');
      if (operation.context.batch.unit === 'piece' && operation.context.batch.value !== String(products.get(operation.productId)?.target)) issue(['operations', index, 'context', 'batch'], 'Pomiar innej skali wymaga jawnej estymacji.');
      const labor = operation.demands.filter(demand => resources.get(demand.resourceId)?.kind === 'role');
      const segments = labor.flatMap(demand => {
        const amount = known(demand.amount); const duration = known(demand.duration);
        if (demand.unit !== 'person' || amount === null || !/^\d+$/.test(amount) || duration === null || !decimalSchema.safeParse(duration).success || !decimalSchema.safeParse(demand.offsetMinutes).success) return [];
        const start = decimal(demand.offsetMinutes);
        return [{ start, end: add(start, decimal(duration)), amount: BigInt(amount) }];
      });
      // Concurrent role demands are headcount, not summed person-minutes or inferred identities.
      const staff = segments.reduce((peak, segment) => {
        const concurrent = segments.reduce((sum, other) => compare(other.start, segment.start) <= 0n && compare(other.end, segment.start) > 0n ? sum + other.amount : sum, 0n);
        return concurrent > peak ? concurrent : peak;
      }, 0n);
      if (segments.length !== labor.length || staff !== BigInt(operation.context.staff)) issue(['operations', index, 'context', 'staff'], 'Obsada pomiaru nie odpowiada zapotrzebowaniu ról; wskaż estymację z oryginalnym pomiarem albo brak czasu.');
    }
    operation.demands.forEach((demand, demandIndex) => {
      const resource = resources.get(demand.resourceId);
      if (!resource) issue(['operations', index, 'demands', demandIndex], 'Nieznany zasób.');
      const amount = known(demand.amount);
      if (demand.unit === 'person' && amount !== null && !/^\d+$/.test(amount)) issue(['operations', index, 'demands', demandIndex], 'Obsada musi być całkowita.');
      if (demand.duration.unit !== 'min') issue(['operations', index, 'demands', demandIndex], 'Czas wymaga minut.');
      const duration = known(operation.duration); const segment = known(demand.duration);
      if (duration !== null && segment !== null && Number(demand.offsetMinutes) + Number(segment) > Number(duration)) issue(['operations', index, 'demands', demandIndex], 'Odcinek wykracza poza operację.');
    });
  });
  value.products.forEach((product, index) => {
    if (!operations.has(product.readyOperationId)) issue(['products', index, 'readyOperationId'], 'Wskaż operację gotowości.');
    if (operations.get(product.readyOperationId)?.productId !== product.id) issue(['products', index, 'readyOperationId'], 'Operacja gotowości dotyczy innego produktu.');
    for (const field of ['price', 'unitCost'] as const) if (product[field].unit !== 'PLN/piece') issue(['products', index, field, 'unit'], 'Wymagana jednostka PLN/piece.');
    const loss = known(product.lossPercent); if (loss !== null && Number(loss) > 100) issue(['products', index, 'lossPercent'], 'Strata przekracza 100%.');
  });
  value.resources.forEach((resource, index) => {
    const capacity = known(resource.capacity);
    if (resource.unit === 'person' && capacity !== null && !/^\d+$/.test(capacity)) issue(['resources', index, 'capacity'], 'Obsada musi być całkowita.');
    const intervals = [...resource.availability].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    if (intervals.some((interval, i) => i > 0 && Date.parse(interval.start) < Date.parse(intervals[i - 1].end))) issue(['resources', index, 'availability'], 'Przedziały dostępności nakładają się.');
  });
  const movements = new Map<string, string>();
  value.lots.forEach((lot, index) => {
    if (lot.expiresAt && Date.parse(lot.expiresAt) <= Date.parse(lot.availableAt)) issue(['lots', index, 'expiresAt'], 'Koniec przydatności poprzedza dostępność.');
    if (lot.readyOperationId && !operations.has(lot.readyOperationId)) issue(['lots', index, 'readyOperationId'], 'Nieznana operacja gotowości.');
    if (lot.productId && !products.has(lot.productId)) issue(['lots', index, 'productId'], 'Nieznany produkt.');
    if (lot.kind === 'finished' && lot.readyOperationId && operations.get(lot.readyOperationId)?.productId !== lot.productId) issue(['lots', index, 'readyOperationId'], 'Operacja i partia dotyczą innych produktów.');
  });
  value.products.forEach((product, index) => {
    const produced = value.lots.filter(lot => lot.productId === product.id && lot.readyOperationId && lot.quantity?.unit === 'piece').reduce((sum, lot) => sum + BigInt(lot.quantity!.value), 0n);
    if (produced > BigInt(product.target)) issue(['products', index, 'target'], 'Partie wyrobów przekraczają zadaną produkcję.');
  });
  value.movements.forEach((movement, index) => {
    if (movement.id.startsWith('recipe:')) issue(['movements', index, 'id'], 'Tożsamość recipe: jest zarezerwowana dla zużycia wyliczonego z publikacji.');
    const content = JSON.stringify(movement);
    if (movements.has(movement.id) && movements.get(movement.id) !== content) issue(['movements', index, 'id'], 'Sprzeczna treść ruchu.');
    movements.set(movement.id, content);
    if (!lotIds.has(movement.lotId)) issue(['movements', index, 'lotId'], 'Nieznana partia.');
    if (Date.parse(movement.at) < Date.parse(value.interval.start) || Date.parse(movement.at) >= Date.parse(value.interval.end)) issue(['movements', index, 'at'], 'Ruch wykracza poza badany okres.');
  });
  const expenses = new Map<string, Set<string>>();
  value.finance.costs.forEach((cost, index) => {
    const methods = expenses.get(cost.expenseId) ?? new Set<string>();
    if (methods.size && (cost.method !== 'component' || methods.has('pool') || methods.has('full-unit'))) issue(['finance', 'costs', index], 'Ten sam wydatek wymaga jednej puli, jednego pełnego kosztu albo odrębnych składników.');
    methods.add(cost.method); expenses.set(cost.expenseId, methods);
    const product = cost.productId ? products.get(cost.productId) : undefined;
    if (cost.basis === 'product' && product && known(product.unitCost) !== null) issue(['finance', 'costs', index], 'Pełny koszt produktu i składniki dublują ten sam wydatek.');
  });
  for (const field of ['costs', 'mix'] as const) {
    const rows = field === 'costs' ? value.finance.costs.map(row => row.id) : value.finance.requiredSales.mix.map(row => row.productId);
    if (rows.length !== new Set(rows).size) issue(['finance', field], 'Powtórzona tożsamość kosztu lub produktu miksu.');
  }
  value.finance.requiredSales.mix.forEach((row, index) => {
    if (!products.has(row.productId)) issue(['finance', 'requiredSales', 'mix', index, 'productId'], 'Nieznany produkt miksu.');
    const loss = known(row.lossPercent); if (loss !== null && Number(loss) > 100) issue(['finance', 'requiredSales', 'mix', index, 'lossPercent'], 'Strata przekracza 100%.');
  });
});
export const publicationSnapshotSchema = z.strictObject({ productId: keySchema, publicationId: z.number().int().positive(), versionKey: keySchema, snapshot: snapshotSchema });
export const savedInputSchema = z.strictObject({ input: scenarioSchema, publications: z.array(publicationSnapshotSchema) });
export type ScenarioInput = z.infer<typeof scenarioSchema>;
export type SavedInput = z.infer<typeof savedInputSchema>;
