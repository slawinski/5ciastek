import { z } from 'zod';
import type { SavedInputV2 } from '../investment-scenarios/schema-v2';
import { evidenceSchema, known, type Evidence } from '../investment-scenarios/values';
import type { evaluateWeek } from '../process-execution/week';
import type { evaluateWeeklyStock } from '../stock-inventory/recipe-coverage';
import { evaluateProcess } from '../process-execution/evaluate';
import { quantityText, quantityUnits } from '../stock-inventory/quantity';
import { add, compare, decimal, divide, money, ratio, subtract, times } from './money';
import type { Rational } from '../recipes/precision';
import type { evaluateEconomics } from './evaluate';
import { requiredSales } from './required-sales';

export const qualifiedValueSchema = z.strictObject({ status: z.enum(['qualified', 'unverified']), value: z.string().nullable(), unit: z.string(), period: z.string(), basis: z.string(), reasons: z.array(z.string()) });
export const monthReportSchema = z.strictObject({ period: z.string(), productionDays: z.number(), salesDays: z.number(),
  sold: z.record(z.string(), z.string()), produced: z.record(z.string(), z.string()), laborMinutes: z.record(z.string(), z.number()),
  repeatability: qualifiedValueSchema, revenue: qualifiedValueSchema, variableCost: qualifiedValueSchema, contribution: qualifiedValueSchema, fixedCost: qualifiedValueSchema, operating: qualifiedValueSchema, ownerNet: qualifiedValueSchema, recurringCash: qualifiedValueSchema, ownerEconomicValue: qualifiedValueSchema,
  requiredSales: z.strictObject({ status: z.enum(['calculated', 'unverified', 'no-finite-solution']), sold: z.record(z.string(), z.string()), produced: z.record(z.string(), z.string()), revenue: z.string().nullable(), variableCost: z.string().nullable(), contribution: z.string().nullable(), period: z.string(), reason: z.string() }),
  comparison: z.record(z.string(), z.strictObject({ ready: z.string().nullable(), required: z.string(), deficit: z.string().nullable() })),
  ledger: z.array(z.strictObject({ id: z.string(), expenseId: z.string(), amount: z.string().nullable(), basis: z.string(), evidence: z.array(evidenceSchema) })),
  boundaryStock: z.array(z.strictObject({ itemId: z.string(), unit: z.string(), opening: z.string(), closing: z.string(), sourceParts: z.array(z.string()) })),
});

function localDate(instant: string, zone: string) { return new Intl.DateTimeFormat('sv-SE', { timeZone: zone }).format(new Date(instant)); }
function shift(instant: string, date: string, zone: string, time?: string) {
  const format = (value: number) => new Intl.DateTimeFormat('sv-SE', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(value)).replace(' ', 'T');
  const wanted = Date.parse(`${date}T${time ?? format(Date.parse(instant)).slice(11)}Z`); let candidate = wanted;
  for (let i = 0; i < 3; i++) candidate += wanted - Date.parse(`${format(candidate)}Z`);
  return candidate;
}

// Shift the whole profile, not each timestamp independently: completion and expiry
// may be on later local dates than the production profile's first operation.
function mapped(instant: string, profile: string, date: string, zone: string) {
  const offset = Date.parse(`${localDate(instant, zone)}T00:00:00Z`) - Date.parse(`${profile}T00:00:00Z`);
  const target = new Date(Date.parse(`${date}T00:00:00Z`) + offset).toISOString().slice(0, 10);
  return shift(instant, target, zone);
}

export function evaluateMonth(saved: SavedInputV2, process: ReturnType<typeof evaluateWeek>, stock: Omit<ReturnType<typeof evaluateWeeklyStock>, 'recipeRequirements'>, economics: ReturnType<typeof evaluateEconomics>) {
  const { input } = saved; if (!input.month) return null; const month = input.month;
  const nextMonth = new Date(`${month.period}-01T00:00:00Z`); nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
  const boundary = shift(`${month.period}-01T00:00:00Z`, nextMonth.toISOString().slice(0, 10), input.interval.zone, '00:00:00');
  const openingAt = shift(`${month.period}-01T00:00:00Z`, `${month.period}-01`, input.interval.zone, '00:00:00');
  const reasons: string[] = []; const variableReasons: string[] = []; const revenueReasons: string[] = []; const fixedReasons: string[] = []; const cashReasons: string[] = [];
  const amount = (evidence: Evidence, identity: string, target: string[], unit = 'PLN'): Rational | null => {
    if (evidence.status === 'missing' || evidence.unit !== unit || evidence.period !== month.period) { target.push(`${identity}: brak źródłowej wartości ${unit} dla ${month.period}.`); return null; }
    return decimal(evidence.value);
  };
  const qualified = (value: Rational | null, problems: string[], basis: string, unit = 'PLN') => ({ status: problems.length || value === null ? 'unverified' as const : 'qualified' as const, value: problems.length || value === null ? null : money(value), unit, period: month.period, basis, reasons: [...new Set(problems)] });
  interface Portion { itemId: string; unit: string; remaining: bigint; ready: number; expiry: number | null; admitted: boolean; source: string[]; capacityCounted?: boolean }
  const portions: Portion[] = month.openingLots.map(lot => {
    if (!lot.quantity || !lot.expiresAt || lot.admitted === null || !lot.admissionSource || lot.evidence.status === 'missing' || lot.readyOperationId) reasons.push(`${lot.id}: niepełny stan otwarcia miesiąca lub nierozliczona gotowość.`);
    if (Date.parse(lot.availableAt) > openingAt) reasons.push(`${lot.id}: zapas otwarcia nie jest dostępny na początku miesiąca.`);
    return { itemId: lot.productId ?? lot.itemId, unit: lot.quantity?.unit ?? 'g', remaining: lot.quantity ? quantityUnits(lot.quantity.value) : 0n, ready: Date.parse(lot.availableAt), expiry: lot.expiresAt ? Date.parse(lot.expiresAt) : null, admitted: lot.admitted === true && !!lot.admissionSource && lot.evidence.status !== 'missing' && !lot.readyOperationId, source: lot.sourceParts };
  });
  const opening = new Map<string, bigint>();
  for (const portion of portions) { const key = `${portion.itemId}|${portion.unit}`; opening.set(key, (opening.get(key) ?? 0n) + portion.remaining); }
  const ledger: z.infer<typeof monthReportSchema>['ledger'] = []; const expenses = new Map<string, Rational | null>();
  function expense(id: string, expenseId: string, value: Rational | null, basis: string, problems = variableReasons) {
    if (expenses.has(expenseId)) { problems.push(`${expenseId}: wydatek został rozliczony więcej niż raz.`); return false; }
    const product = input.products.find(row => `product:${row.id}` === id);
    const source = input.finance.costs.find(row => row.id === id);
    const wip = input.openingWip.find(row => row.id === id);
    const preparation = month.preparations.find(row => row.id === id);
    const fixed = month.fixedCosts.find(row => row.id === id);
    const evidence = product ? [product.unitCost] : source ? [source.quantity, source.rate] : wip ? [wip.evidence, wip.priorCost, wip.priorLabor] : preparation ? [preparation.evidence, preparation.materialCost, preparation.laborRate] : fixed ? [fixed.amount] : [];
    expenses.set(expenseId, value); ledger.push({ id, expenseId, amount: value === null ? null : money(value), basis, evidence });
    return true;
  }
  type Demand = { itemId: string; unit: string; quantity: bigint };
  type Event = { id: string; at: number; kind: 'consume' | 'produce' | 'sale' | 'waste'; batchKey?: string; productId?: string; demands: Demand[]; expiry?: number | null; admitted?: boolean };
  const events: Event[] = []; const produced: Record<string, string> = {}; const sold: Record<string, string> = {}; const laborMinutes: Record<string, number> = {};
  const batchSupported = new Map<string, boolean>();
  const readyPieces = new Map<string, bigint>();
  const batchCounts = new Map<string, number>();
  const reservations: typeof process.reservations = [];
  for (const day of [...month.calendar].sort((a, b) => a.date.localeCompare(b.date))) {
    if (day.evidence.status === 'missing' || day.evidence.period !== month.period || day.evidence.unit !== 'day') reasons.push(`${day.date}: brak źródła mapowania kalendarza dla miesiąca.`);
    if (day.productionProfile) {
      let mappedBatches = 0;
      for (const batch of input.batches) {
        const batchOperations = process.operations.filter(row => input.operations.some(operation => operation.id === row.id && operation.batchId === batch.id));
        const first = batchOperations.filter(row => row.start).sort((a, b) => Date.parse(a.start!) - Date.parse(b.start!))[0];
        if (!first?.start || localDate(first.start, input.interval.zone) !== day.productionProfile) continue;
        mappedBatches++;
        const ready = batchOperations.find(row => row.id === batch.readyOperationId); const key = `${day.date}:${batch.id}`;
        batchCounts.set(batch.id, (batchCounts.get(batch.id) ?? 0) + 1);
        produced[batch.productId] = quantityText(quantityUnits(produced[batch.productId] ?? '0') + BigInt(batch.target) * 1000n);
        const demands: Demand[] = stock.coverage.filter(row => row.batchId === batch.id).map(row => ({ itemId: String(row.ingredientId), unit: 'g', quantity: quantityUnits(row.required) - quantityUnits(row.fromWip) }));
        for (const wip of input.openingWip.filter(row => row.batchId === batch.id)) {
          demands.push({ itemId: `wip:${wip.id}`, unit: wip.quantity.unit, quantity: quantityUnits(wip.quantity.value) });
          if (known(wip.priorLabor) === null || known(wip.priorCost) === null || known(wip.evidence) === null) reasons.push(`${wip.id}: nieznana praca, koszt lub pochodzenie przygotowania przed tygodniem.`);
        }
        events.push({ id: `consume:${key}`, at: shift(first.start, day.date, input.interval.zone), kind: 'consume', batchKey: key, demands });
        for (const reservation of process.reservations.filter(row => batchOperations.some(operation => operation.id === row.operationId))) {
          reservations.push({ ...reservation, start: mapped(new Date(reservation.start).toISOString(), day.productionProfile, day.date, input.interval.zone), end: mapped(new Date(reservation.end).toISOString(), day.productionProfile, day.date, input.interval.zone) });
          if (input.resources.find(row => row.id === reservation.resourceId)?.kind === 'role') laborMinutes[reservation.resourceId] = (laborMinutes[reservation.resourceId] ?? 0) + (reservation.end - reservation.start) / 60000 * Number(reservation.amount);
        }
        if (!ready?.end || ready.deadlineMissed) { reasons.push(`${key}: brak terminowej gotowości partii.`); continue; }
        const lots = input.lots.filter(row => row.batchId === batch.id && row.readyOperationId === ready.id);
        for (const lot of lots) events.push({ id: `produce:${key}:${lot.id}`, at: Math.max(mapped(ready.end, day.productionProfile, day.date, input.interval.zone), mapped(lot.availableAt, day.productionProfile, day.date, input.interval.zone)), kind: 'produce', batchKey: key, productId: batch.productId,
          demands: [{ itemId: batch.productId, unit: 'piece', quantity: lot.quantity ? quantityUnits(lot.quantity.value) : 0n }], expiry: lot.expiresAt ? mapped(lot.expiresAt, day.productionProfile, day.date, input.interval.zone) : null, admitted: lot.admitted === true && !!lot.admissionSource && lot.evidence.status !== 'missing' });
      }
      if (!mappedBatches) reasons.push(`${day.date}: profil produkcji nie zawiera gotowej do mapowania partii.`);
    }
    if (day.salesProfile) for (const movement of [...new Map(input.movements.map(row => [row.id, row])).values()].filter(row => row.kind === 'sale' && localDate(row.at, input.interval.zone) === day.salesProfile)) {
      const lot = input.lots.find(row => row.id === movement.lotId)!;
      events.push({ id: `sale:${day.date}:${movement.id}`, at: shift(movement.at, day.date, input.interval.zone), kind: 'sale', productId: lot.productId ?? lot.itemId, demands: [{ itemId: lot.productId ?? lot.itemId, unit: movement.quantity.unit, quantity: quantityUnits(movement.quantity.value) }] });
    }
  }
  let variable = ratio(0n); let revenue = ratio(0n); let fixed = ratio(0n);
  for (const product of input.products) {
    const cost = known(product.unitCost); const quantity = produced[product.id] ?? '0';
    if (cost === null && !input.finance.costs.some(row => row.productId === product.id && row.basis === 'product')) variableReasons.push(`${product.id}: brak pełnego kosztu produkcji.`);
    const value = cost === null ? null : times(decimal(quantity), decimal(cost));
    if (cost !== null) { expense(`product:${product.id}`, `product:${product.id}`, value, 'Koszt wszystkich wyprodukowanych sztuk'); if (value) variable = add(variable, value); }
  }
  for (const row of economics.costs.filter(row => row.category !== 'owner-value' && (row.basis === 'variable' || row.basis === 'product'))) {
    if (row.amount === null) { variableReasons.push(`${row.id}: niepełny koszt tygodnia.`); expense(row.id, row.expenseId, null, 'Koszt mapowany z tygodnia'); continue; }
    const source = input.finance.costs.find(cost => cost.id === row.id)!;
    const allocations = source.productId ? [{ productId: source.productId, share: '1' }] : source.allocations;
    if (!allocations.length || compare(allocations.reduce((sum, allocation) => add(sum, decimal(allocation.share)), ratio(0n)), decimal('1')) !== 0n) { variableReasons.push(`${row.id}: brak alokacji kosztu do profili.`); continue; }
    let factor = ratio(0n);
    for (const allocation of allocations) {
      const sourceQuantity = input.batches.filter(batch => batch.productId === allocation.productId).reduce((sum, batch) => sum + batch.target, 0);
      if (!sourceQuantity) { variableReasons.push(`${row.id}: brak partii dla alokacji.`); continue; }
      factor = add(factor, times(decimal(allocation.share), divide(decimal(produced[allocation.productId] ?? '0'), decimal(String(sourceQuantity)))));
    }
    // The weekly report rounds money for display. Scale the validated source
    // quantities/rates instead so sub-cent costs survive calendar aggregation.
    const scales: Record<string, bigint> = { kg: 1000n, 'person-hour': 60n, hour: 60n };
    const sourceValue = times(times(decimal(known(source.quantity)!), decimal(known(source.rate)!)), ratio(scales[source.quantity.unit] ?? 1n, scales[source.rate.unit.slice(4)] ?? 1n));
    const value = times(sourceValue, factor); if (expense(row.id, row.expenseId, value, 'Źródłowa alokacja produkcji')) variable = add(variable, value);
  }
  for (const wip of input.openingWip) {
    const count = batchCounts.get(wip.batchId) ?? 0; if (!count) continue;
    const priorCost = known(wip.priorCost); const priorLabor = known(wip.priorLabor);
    if (wip.priorCost.status === 'missing' || wip.priorCost.period !== input.period) variableReasons.push(`${wip.id}: brak kosztu wcześniejszego przygotowania WIP dla okresu profilu.`);
    const cost = priorCost === null ? null : times(decimal(priorCost), decimal(String(count)));
    if (expense(wip.id, `wip:${wip.id}`, cost, 'Źródłowy koszt wcześniejszego WIP według liczby partii') && cost) variable = add(variable, cost);
    if (wip.priorLabor.status !== 'missing' && wip.priorLabor.unit === 'person-min' && wip.priorLabor.period === input.period) laborMinutes[`prior:${wip.id}`] = Number(priorLabor) * count;
    else reasons.push(`${wip.id}: brak źródłowych osobominut wcześniejszego WIP dla okresu profilu.`);
  }
  const coveredMovements = new Set<string>();
  const preparationExpenses = new Set<string>();
  const resourceDefinitions = new Map(input.resources.map(row => [row.id, row]));
  for (const preparation of month.preparations) {
    const prepReasons: string[] = []; const material = amount(preparation.materialCost, preparation.id, prepReasons);
    const rate = amount(preparation.laborRate, preparation.id, prepReasons, 'PLN/person-hour');
    if (preparationExpenses.has(preparation.expenseId)) prepReasons.push(`${preparation.id}: powtórzona tożsamość kosztu przygotowania.`);
    preparationExpenses.add(preparation.expenseId);
    if (!preparation.admitted || preparation.evidence.status === 'missing' || Date.parse(preparation.expiresAt) <= Date.parse(preparation.readyAt)) prepReasons.push(`${preparation.id}: brak źródła, dopuszczenia lub ważności przygotowania.`);
    if (!preparation.operations.length) prepReasons.push(`${preparation.id}: brak jawnego czasu przygotowania.`);
    const start = Math.min(Date.parse(preparation.readyAt) - 1, ...preparation.operations.map(row => Date.parse(row.requestedStart)));
    const pending = new Map(preparation.operations.map(row => [row.id, row])); const complete = new Set<string>();
    while (pending.size) {
      const next = [...pending.values()].find(row => [...row.predecessors, ...(row.phase ? [row.phase.id] : [])].every(id => complete.has(id)));
      if (!next) break;
      pending.delete(next.id); complete.add(next.id);
    }
    const invalid = pending.size > 0 || complete.size !== preparation.operations.length || new Set(preparation.resources.map(row => row.id)).size !== preparation.resources.length;
    if (invalid || preparation.operations.some(row => row.duration.unit !== 'min' || row.demands.some(demand => demand.duration.unit !== 'min'))) prepReasons.push(`${preparation.id}: nieprawidłowe zależności, tożsamości lub jednostki czasu przygotowania.`);
    const prep = evaluateProcess(invalid ? [] : preparation.operations, preparation.resources, { start: new Date(start).toISOString(), end: preparation.readyAt });
    if (prep.operations.some(row => !row.end || row.deadlineMissed || Date.parse(row.end) > Date.parse(preparation.readyAt)) || prep.qualifications.length) prepReasons.push(`${preparation.id}: niepotwierdzona dostępność lub termin przygotowania.`);
    for (const resource of preparation.resources) {
      const peers = [...reservations, ...prep.reservations].filter(row => row.resourceId === resource.id && row.end > row.start);
      const capacity = known(resource.capacity);
      const canonical = resourceDefinitions.get(resource.id);
      if (canonical && (canonical.unit !== resource.unit || known(canonical.capacity) !== capacity)) prepReasons.push(`${preparation.id}: sprzeczna definicja zasobu ${resource.id}.`);
      resourceDefinitions.set(resource.id, resource);
      if (capacity === null || peers.some(point => compare(peers.filter(row => row.start <= point.start && row.end > point.start).reduce((sum, row) => add(sum, decimal(row.amount)), ratio(0n)), decimal(capacity)) > 0n)) prepReasons.push(`${preparation.id}: konflikt rezerwacji ${resource.id}.`);
    }
    reservations.push(...prep.reservations);
    for (const [id, minutes] of Object.entries(prep.laborMinutes)) laborMinutes[id] = (laborMinutes[id] ?? 0) + minutes;
    const minutes = Object.values(prep.laborMinutes).reduce((sum, value) => sum + value, 0);
    const laborComplete = !invalid && prep.operations.every(row => row.end !== null);
    const cost = material && rate && laborComplete ? add(material, times(divide(decimal(String(minutes)), decimal('60')), rate)) : null;
    if (new Set(preparation.coveredMovementIds).size !== preparation.coveredMovementIds.length || preparation.coveredMovementIds.some(id => (!stock.movements.some(row => row.id === id) && !input.openingWip.some(row => `wip:${row.id}` === id)) || coveredMovements.has(id))) prepReasons.push(`${preparation.id}: nieznane lub powtórzone pokrycie przygotowania.`);
    preparation.coveredMovementIds.forEach(id => coveredMovements.add(id));
    if (expenses.has(preparation.expenseId)) {
      if (!preparation.coveredMovementIds.length || cost === null || expenses.get(preparation.expenseId) === null || compare(cost, expenses.get(preparation.expenseId)!) !== 0n) { const problem = `${preparation.id}: nieuzgodnione włączenie do już rozliczonego kosztu.`; prepReasons.push(problem); variableReasons.push(problem); }
      else ledger.find(row => row.expenseId === preparation.expenseId)!.evidence.push(preparation.evidence, preparation.materialCost, preparation.laborRate);
    } else { expense(preparation.id, preparation.expenseId, cost, 'Przygotowanie poza tygodniem liczone raz'); if (cost) variable = add(variable, cost); }
    reasons.push(...prepReasons); if (cost === null) variableReasons.push(...prepReasons);
    portions.push({ itemId: preparation.itemId, unit: preparation.quantity.unit, remaining: quantityUnits(preparation.quantity.value), ready: Date.parse(preparation.readyAt), expiry: Date.parse(preparation.expiresAt), admitted: preparation.admitted && preparation.evidence.status !== 'missing' && !prepReasons.length, source: [preparation.id] });
  }
  for (const event of events.filter(row => row.at < boundary).sort((a, b) => a.at - b.at || ({ consume: 0, produce: 1, waste: 2, sale: 3 }[a.kind] - { consume: 0, produce: 1, waste: 2, sale: 3 }[b.kind]) || a.id.localeCompare(b.id))) {
    if (event.kind === 'produce') {
      if (!batchSupported.get(event.batchKey!)) continue;
      for (const demand of event.demands) portions.push({ itemId: demand.itemId, unit: demand.unit, remaining: demand.quantity, ready: event.at, expiry: event.expiry ?? null, admitted: event.admitted === true, source: [event.id] });
      continue;
    }
    let supported = true;
    for (const demand of event.demands) {
      let remaining = demand.quantity;
      const eligible = portions.filter(row => row.itemId === demand.itemId && row.unit === demand.unit && row.admitted && row.ready <= event.at && row.expiry !== null && row.expiry > event.at).sort((a, b) => a.expiry! - b.expiry! || a.source.join().localeCompare(b.source.join()));
      for (const portion of eligible) {
        if (event.kind === 'sale' && demand.unit === 'piece' && !portion.capacityCounted) {
          readyPieces.set(demand.itemId, (readyPieces.get(demand.itemId) ?? 0n) + portion.remaining);
          portion.capacityCounted = true;
        }
      }
      for (const portion of eligible) {
        const taken = remaining < portion.remaining ? remaining : portion.remaining; portion.remaining -= taken; remaining -= taken; if (!remaining) break;
      }
      if (remaining > 0n) { supported = false; reasons.push(`${event.id}: niedobór ${quantityText(remaining)} ${demand.unit} (${demand.itemId}).`); }
      if (event.kind === 'sale') sold[event.productId!] = quantityText(quantityUnits(sold[event.productId!] ?? '0') + demand.quantity - remaining);
    }
    if (event.kind === 'consume') batchSupported.set(event.batchKey!, supported);
  }
  for (const product of input.products) {
    const price = known(product.price);
    if (price === null) revenueReasons.push(`${product.id}: brak ceny sprzedaży.`);
    else revenue = add(revenue, times(decimal(sold[product.id] ?? '0'), decimal(price)));
  }
  if (process.qualifications.length || stock.coverage.some(row => row.status !== 'verified')) reasons.push('Ograniczenia tygodnia lub pokrycie materiałowe pozostają niezweryfikowane.');
  const boundaryStock = [...new Set([...opening.keys(), ...portions.map(row => `${row.itemId}|${row.unit}`)])].map(key => {
    const [itemId, unit] = key.split('|'); const initial = opening.get(key) ?? 0n;
    const matching = portions.filter(row => `${row.itemId}|${row.unit}` === key);
    const closing = matching.filter(row => row.ready < boundary).reduce((sum, row) => sum + row.remaining, 0n);
    const replacement = matching.filter(row => row.ready === boundary && row.admitted && row.expiry !== null && row.expiry > row.ready).reduce((sum, row) => sum + row.remaining, 0n);
    const usableClosing = matching.filter(row => row.ready < boundary && row.admitted && row.expiry !== null && row.expiry >= boundary).reduce((sum, row) => sum + row.remaining, 0n);
    if (initial > usableClosing + replacement) reasons.push(`${itemId}: nieuzgodnione netto zużycie ${quantityText(initial - usableClosing - replacement)} ${unit} zapasu otwarcia.`);
    return { itemId, unit, opening: quantityText(initial), closing: quantityText(closing), sourceParts: [...new Set(matching.flatMap(row => row.source))] };
  });
  for (const category of ['rent', 'seller']) if (!month.fixedCosts.some(row => row.category === category)) fixedReasons.push(`Brak kosztu: ${category === 'rent' ? 'najem' : 'osobny sprzedawca'}.`);
  for (const cost of month.fixedCosts) { const value = amount(cost.amount, cost.id, fixedReasons); if (expense(cost.id, cost.expenseId, value, 'Stały koszt miesiąca — raz', fixedReasons) && value) fixed = add(fixed, value); }
  if (month.taxBasis !== input.finance.taxBasis) fixedReasons.push('Niezgodna podstawa brutto/netto tygodnia i miesiąca.');
  const chargesReasons: string[] = []; const incomeReasons: string[] = [];
  const charges = amount(month.ownerCharges, 'Obciążenia właściciela', chargesReasons); const income = amount(month.ownerIncome, 'Dochód netto właściciela', incomeReasons);
  let cash = ratio(0n); let receipts = ratio(0n); const included = new Set<string>();
  const cashIdentities = new Set<string>();
  for (const entry of month.cashEntries) {
    if (cashIdentities.has(entry.expenseId)) { cashReasons.push(`${entry.id}: powtórzona tożsamość przepływu ${entry.expenseId}.`); continue; }
    cashIdentities.add(entry.expenseId);
    if (entry.kind !== 'payment' && expenses.has(entry.expenseId)) cashReasons.push(`${entry.id}: przepływ kosztu wymaga jawnego uzgodnienia płatności.`);
    const value = amount(entry.amount, entry.id, cashReasons); if (!value) continue;
    if (entry.kind === 'payment') {
      let reconciled = ratio(0n);
      if (!entry.includedExpenseIds.length) cashReasons.push(`${entry.id}: brak uzgodnienia wydatków.`);
      for (const id of entry.includedExpenseIds) {
        const expenseValue = expenses.get(id);
        if (included.has(id) || expenseValue == null) cashReasons.push(`${entry.id}: powtórzony lub nieznany wydatek ${id}.`);
        else reconciled = add(reconciled, expenseValue);
        included.add(id);
      }
      if (compare(value, reconciled) !== 0n) cashReasons.push(`${entry.id}: kwota nie odpowiada ujawnionym wydatkom.`);
    }
    if (entry.kind === 'receipt') receipts = add(receipts, value);
    cash = ['payment', 'other-out', 'inventory-change'].includes(entry.kind) ? subtract(cash, value) : add(cash, value);
    ledger.push({ id: entry.id, expenseId: entry.expenseId, amount: money(value), basis: `Gotówka: ${entry.kind}`, evidence: [entry.amount] });
  }
  if (!month.cashEntries.some(entry => entry.kind === 'receipt') || compare(receipts, revenue) > 0n) cashReasons.push('Brak wpływów lub wpływy niepokryte sprzedażą.');
  for (const id of expenses.keys()) if (!included.has(id)) cashReasons.push(`Brak uzgodnienia płatności za ${id}.`);
  const contribution = subtract(revenue, variable); const operating = subtract(contribution, fixed);
  const netReasons = [...revenueReasons, ...variableReasons, ...fixedReasons, ...chargesReasons];
  const cashProblems = [...netReasons, ...reasons, ...incomeReasons, ...cashReasons];
  const economicValueReasons: string[] = []; const economicValue = amount(month.ownerEconomicValue, 'Wartość ekonomiczna pracy właściciela', economicValueReasons);
  const requirement = input.finance.requiredSales;
  const aligned = requirement.period === month.period && requirement.budget.status !== 'missing' && requirement.budget.period === month.period;
  const required = requiredSales(aligned ? requirement : { ...requirement, period: month.period, budget: { status: 'missing', unit: 'PLN', reason: 'Brak budżetu dla badanego miesiąca.' } });
  const comparison: z.infer<typeof monthReportSchema>['comparison'] = {};
  for (const [productId, quantity] of Object.entries(required.sold)) {
    const ready = reasons.length ? null : quantityText(readyPieces.get(productId) ?? 0n);
    const deficit = ready === null ? null : quantityUnits(quantity) > quantityUnits(ready) ? quantityText(quantityUnits(quantity) - quantityUnits(ready)) : '0';
    comparison[productId] = { ready, required: quantity, deficit };
  }
  return { period: month.period, productionDays: month.calendar.filter(row => row.productionProfile).length, salesDays: month.calendar.filter(row => row.salesProfile).length, sold, produced, laborMinutes,
    repeatability: qualified(ratio(0n), reasons, 'Kalendarz i odtworzenie zapasu', 'qualification'),
    revenue: qualified(revenue, revenueReasons, 'Wyłącznie sprzedaż pokryta gotowym zapasem'), variableCost: qualified(variable, variableReasons, 'Wszystkie partie i przygotowanie'), contribution: qualified(contribution, [...revenueReasons, ...variableReasons], 'Przychód minus koszty zmienne'), fixedCost: qualified(fixed, fixedReasons, 'Stałe koszty miesiąca raz'),
    operating: qualified(operating, [...revenueReasons, ...variableReasons, ...fixedReasons], 'Wkład minus koszty stałe'),
    ownerNet: qualified(charges ? subtract(operating, charges) : null, netReasons, 'Wynik operacyjny po jawnych obciążeniach, przed rezerwą dochodu'),
     recurringCash: qualified(charges && income ? subtract(subtract(cash, charges), income) : null, cashProblems, 'Wpływy minus uzgodnione płatności, obciążenia i dochód netto właściciela'),
     ownerEconomicValue: qualified(economicValue, economicValueReasons, 'Osobne ujawnienie; nie jest drugim potrąceniem celu dochodowego'), requiredSales: required, comparison, ledger, boundaryStock,
  };
}
