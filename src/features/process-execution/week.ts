import type { ScenarioV2Input } from '../investment-scenarios/schema-v2';
import { known, type Qualification } from '../investment-scenarios/values';
import { add, compare, decimal, fixed, ratio } from '../economics-investment/money';
import { convertQuantity } from '../stock-inventory/quantity';
import type { ProcessResult, ScheduledOperation } from './evaluate';

export function evaluateWeek(input: ScenarioV2Input) {
  const { interval, resources } = input;
  const result: ProcessResult & {
    laborExposure: Record<string, { before: number; inside: number; after: number }>;
    closingWip: { operationId: string; batchId: string; start: string; plannedEnd: string }[];
    windowChecks: { windowId: string; operationId: string; status: 'checked' | 'violated' | 'unverified'; waitingMinutes: number | null; excessMinutes: number | null; source: string | null }[];
  } = { interval, operations: [], reservations: [], laborMinutes: {}, availablePersonMinutes: {}, qualifications: [], laborExposure: {}, closingWip: [], windowChecks: [] };
  const qualify = (domain: Qualification['domain'], identity: string, reason: string) => result.qualifications.push({ domain, identity, reason });
  const resourceMap = new Map(resources.map(resource => [resource.id, resource]));
  const openingOperationIds = new Set(input.openingWip.map(wip => wip.operationId));
  const pending = [...input.operations].sort((a, b) => Number(openingOperationIds.has(b.id)) - Number(openingOperationIds.has(a.id)) || a.priority - b.priority || a.id.localeCompare(b.id));
  for (const resource of resources.filter(resource => resource.kind === 'role')) {
    const capacity = known(resource.capacity);
    if (capacity !== null) result.availablePersonMinutes[resource.id] = resource.availability.reduce((sum, window) => sum + Math.max(0, Math.min(Date.parse(window.end), Date.parse(interval.end)) - Math.max(Date.parse(window.start), Date.parse(interval.start))) / 60000, 0) * Number(capacity);
  }
  while (pending.length) {
    const index = pending.findIndex(operation => [...operation.predecessors, ...(operation.phase ? [operation.phase.id] : [])].every(id => result.operations.some(row => row.id === id)));
    if (index < 0) throw new Error('Brak poprzednika lub cykl zależności.');
    const operation = pending.splice(index, 1)[0]; const opening = input.openingWip.find(wip => wip.operationId === operation.id);
    const requested = Date.parse(opening?.startedAt ?? operation.requestedStart); const duration = known(operation.duration);
    const predecessors = operation.predecessors.map(id => result.operations.find(row => row.id === id)!);
    const phase = operation.phase ? result.operations.find(row => row.id === operation.phase!.id)! : null;
    const row: ScheduledOperation = { id: operation.id, productId: operation.productId, readyBy: operation.readyBy, start: null, end: null, elapsedMinutes: null, waitingMinutes: null, waitingFor: [], deadlineMissed: null, minutesInside: null, minutesBefore: null };
    const demands = operation.demands.map(demand => {
      const resource = resourceMap.get(demand.resourceId); const amount = known(demand.amount); const minutes = known(demand.duration);
      const domain = resource?.kind === 'role' ? 'people' : 'machines';
      let quantity = null;
      try { if (resource && amount !== null) quantity = convertQuantity(amount, demand.unit, resource.unit, demand.conversion); } catch { /* Report the unavailable dimension below. */ }
      const capacity = resource ? known(resource.capacity) : null;
      if (!resource || quantity === null || minutes === null || capacity === null) qualify(domain, operation.id, `Brak czasu, pojemności lub konwersji: ${demand.resourceId}.`);
      else if (compare(quantity, decimal(capacity)) > 0n) qualify(domain, operation.id, `Wsad lub obsada przekracza pojemność: ${resource.name}.`);
      return { resource, quantity, minutes, offset: Number(demand.offsetMinutes), capacity };
    });
    const validDemands = demands.every(demand => demand.resource && demand.quantity !== null && demand.minutes !== null && demand.capacity !== null && compare(demand.quantity, decimal(demand.capacity)) <= 0n);
    if (opening?.priorLabor.status === 'missing') qualify('people', opening.id, 'Nieznany wcześniejszy nakład przygotowania WIP.');
    if (duration === null || (!opening && (predecessors.some(predecessor => predecessor.end === null) || (phase && phase.start === null)))) qualify('technology', operation.id, 'Brak czasu lub gotowości poprzednika.');
    else {
      const earliest = Math.max(requested, ...predecessors.map(predecessor => Date.parse(predecessor.end!)), phase?.start ? Date.parse(phase.start) + Number(operation.phase!.offsetMinutes) * 60000 : requested);
      const candidates = new Set([earliest]);
      for (const demand of demands) {
        for (const window of demand.resource?.availability ?? []) candidates.add(Math.max(earliest, Date.parse(window.start) - demand.offset * 60000));
        for (const reservation of result.reservations.filter(row => row.resourceId === demand.resource?.id)) candidates.add(Math.max(earliest, reservation.end - demand.offset * 60000));
      }
      const demandFits = (start: number, demand: (typeof demands)[number]) => {
        if (!demand.resource || demand.quantity === null || demand.minutes === null || demand.capacity === null || compare(demand.quantity, decimal(demand.capacity)) > 0n) return false;
        const from = start + demand.offset * 60000; const to = from + Number(demand.minutes) * 60000;
        if (!demand.resource!.availability.some(window => Date.parse(window.start) <= from && Date.parse(window.end) >= to)) return false;
        const own = demands.filter(other => other.resource?.id === demand.resource!.id && other.quantity !== null && other.minutes !== null).map(other => ({ start: start + other.offset * 60000, end: start + (other.offset + Number(other.minutes)) * 60000, amount: fixed(other.quantity!, 9) }));
        const reservations = [...result.reservations.filter(row => row.resourceId === demand.resource!.id), ...own].filter(row => row.start < to && row.end > from);
        return [from, ...reservations.map(row => Math.max(from, row.start))].every(point => compare(reservations.filter(row => row.start <= point && row.end > point).reduce((sum, row) => add(sum, decimal(row.amount)), ratio(0n)), decimal(demand.capacity!)) <= 0n);
      };
      const fits = (start: number) => validDemands && demands.every(demand => demandFits(start, demand));
      const start = opening ? requested : [...candidates].sort((a, b) => a - b).find(candidate => candidate < Date.parse(interval.end) && fits(candidate));
      if (start === undefined) qualify(demands.some(demand => demand.resource?.kind === 'role') ? 'people' : 'machines', operation.id, 'Brak wspólnego przedziału dostępności.');
      else {
        const end = start + Number(duration) * 60000;
        if (opening) for (const demand of demands.filter(demand => !demandFits(start, demand))) qualify(demand.resource?.kind === 'role' ? 'people' : 'machines', operation.id, `Historia WIP zachowana; dostępność lub pojemność rezerwacji ${demand.resource?.id ?? 'nieznanego zasobu'} niezweryfikowana.`);
        Object.assign(row, { start: new Date(start).toISOString(), end: new Date(end).toISOString(), elapsedMinutes: Number(duration), waitingMinutes: (start - requested) / 60000, deadlineMissed: end > Date.parse(operation.readyBy),
          minutesInside: Math.max(0, Math.min(end, Date.parse(interval.end)) - Math.max(start, Date.parse(interval.start))) / 60000,
          minutesBefore: Math.max(0, Math.min(end, Date.parse(interval.start)) - start) / 60000 });
        if (earliest > requested) { row.waitingFor.push('poprzednik'); qualify('technology', operation.id, 'Żądany start poprzedza gotowość poprzednika.'); }
        if (start > earliest) row.waitingFor.push(...demands.flatMap(demand => demand.resource ? [demand.resource.id] : []));
        if (phase?.end && end > Date.parse(phase.end)) qualify('technology', operation.id, 'Czynność wykracza poza etap pasywny.');
        if (end > Date.parse(interval.end)) result.closingWip.push({ operationId: operation.id, batchId: operation.batchId, start: row.start!, plannedEnd: row.end! });
        for (const demand of demands) {
          if (!demand.resource || demand.quantity === null || demand.minutes === null) continue;
          const from = start + demand.offset * 60000; const to = from + Number(demand.minutes) * 60000;
          result.reservations.push({ resourceId: demand.resource.id, operationId: operation.id, start: from, end: to, amount: fixed(demand.quantity, 9) });
          if (demand.resource.kind === 'role') {
            const amount = Number(demand.quantity.numerator) / Number(demand.quantity.denominator);
            const exposure = result.laborExposure[demand.resource.id] ??= { before: 0, inside: 0, after: 0 };
            exposure.before += Math.max(0, Math.min(to, Date.parse(interval.start)) - from) / 60000 * amount;
            exposure.inside += Math.max(0, Math.min(to, Date.parse(interval.end)) - Math.max(from, Date.parse(interval.start))) / 60000 * amount;
            exposure.after += Math.max(0, to - Math.max(from, Date.parse(interval.end))) / 60000 * amount;
            result.laborMinutes[demand.resource.id] = exposure.inside;
          }
        }
        for (const predecessor of predecessors) {
          const windows = input.windows.filter(window => window.batchId === operation.batchId && window.operationId === operation.id && window.predecessorId === predecessor.id);
          const wait = predecessor.end ? (start - Date.parse(predecessor.end)) / 60000 : null;
          if (!windows.length) qualify('technology', operation.id, 'Brak właściwego źródłowego okna technologicznego.');
          for (const window of windows) {
            const upper = known(window.useUntilMinutes); const source = window.useUntilMinutes.status === 'missing' ? null : window.useUntilMinutes.source;
            const excess = wait === null || upper === null ? null : Math.max(0, wait - Number(upper), Number(window.useFromMinutes) - wait);
            const status = excess === null ? 'unverified' : excess > 0 ? 'violated' : 'checked';
            result.windowChecks.push({ windowId: window.id, operationId: operation.id, status, waitingMinutes: wait, excessMinutes: excess, source });
            if (status !== 'checked') qualify('technology', operation.id, status === 'violated' ? `Naruszenie okna o ${excess} min; źródło: ${source}.` : 'Brak źródłowego okna.');
          }
        }
      }
    }
    result.operations.push(row);
  }
  return result;
}
