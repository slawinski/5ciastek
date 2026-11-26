import type { Operation, Resource } from './schema';
import { known, type Qualification } from '../investment-scenarios/values';
import { add, compare, decimal, fixed, ratio } from '../economics-investment/money';
import type { Rational } from '../recipes/precision';
import { convertQuantity } from '../stock-inventory/quantity';

export interface ScheduledOperation { id: string; productId: string; readyBy: string; start: string | null; end: string | null; elapsedMinutes: number | null; waitingMinutes: number | null; waitingFor: string[]; deadlineMissed: boolean | null; minutesInside: number | null; minutesBefore: number | null }
interface Reservation { resourceId: string; operationId: string; start: number; end: number; amount: string }
export interface ProcessResult { interval: { start: string; end: string }; operations: ScheduledOperation[]; reservations: Reservation[]; laborMinutes: Record<string, number>; availablePersonMinutes: Record<string, number>; qualifications: Qualification[] }
export function evaluateProcess(operations: Operation[], resources: Resource[], interval: { start: string; end: string }): ProcessResult {
  const result: ProcessResult = { interval, operations: [], reservations: [], laborMinutes: {}, availablePersonMinutes: {}, qualifications: [] };
  const resourceMap = new Map(resources.map(resource => [resource.id, resource]));
  const exactReservations: { record: Reservation; amount: Rational }[] = [];
  const completed = new Map<string, ScheduledOperation>();
  const pending = [...operations].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const qualify = (domain: Qualification['domain'], identity: string, reason: string) => result.qualifications.push({ domain, identity, reason });
  for (const resource of resources.filter(resource => resource.kind === 'role')) {
    const capacity = known(resource.capacity);
    if (capacity !== null) result.availablePersonMinutes[resource.id] = resource.availability.reduce((sum, window) => sum + Math.max(0, Math.min(Date.parse(window.end), Date.parse(interval.end)) - Math.max(Date.parse(window.start), Date.parse(interval.start))) / 60000, 0) * Number(capacity);
  }
  while (pending.length) {
    const index = pending.findIndex(operation => [...operation.predecessors, ...(operation.phase ? [operation.phase.id] : [])].every(id => completed.has(id)));
    if (index < 0) throw new Error('Brak poprzednika lub cykl zależności.');
    const operation = pending.splice(index, 1)[0];
    const requested = Date.parse(operation.requestedStart);
    const row: ScheduledOperation = { id: operation.id, productId: operation.productId, readyBy: operation.readyBy, start: null, end: null, elapsedMinutes: null, waitingMinutes: null, waitingFor: [], deadlineMissed: null, minutesInside: null, minutesBefore: null };
    const duration = known(operation.duration);
    const predecessors = operation.predecessors.map(id => completed.get(id)!);
    const phase = operation.phase ? completed.get(operation.phase.id)! : null;
    let blocked = duration === null || predecessors.some(predecessor => predecessor.end === null) || (phase !== null && phase.start === null);
    if (blocked) qualify('technology', operation.id, 'Brak czasu lub gotowości poprzednika.');
    const demands = operation.demands.map(demand => {
      const resource = resourceMap.get(demand.resourceId);
      const amount = known(demand.amount); const segmentDuration = known(demand.duration); const capacity = resource ? known(resource.capacity) : null;
      let converted = ratio(0n);
      try { if (amount !== null && resource) converted = convertQuantity(amount, demand.unit, resource.unit, demand.conversion); }
      catch { qualify(resource?.kind === 'role' ? 'people' : 'machines', operation.id, `Brak jawnej konwersji: ${demand.resourceId}.`); blocked = true; }
      const domain = resource?.kind === 'role' ? 'people' : 'machines';
      if (!resource || amount === null || capacity === null || segmentDuration === null) {
        qualify(domain, operation.id, `Brak pojemności, czasu, obsady lub konwersji: ${demand.resourceId}.`); blocked = true;
      } else if (compare(converted, decimal(capacity)) > 0n) { qualify(domain, operation.id, `Wsad lub obsada przekracza pojemność: ${resource.name}.`); blocked = true; }
      return { resource, amount: converted, duration: Number(segmentDuration) * 60000, offset: Number(demand.offsetMinutes) * 60000 };
    });
    if (!blocked) {
      const predecessorEnd = Math.max(requested, ...predecessors.map(predecessor => Date.parse(predecessor.end!)));
      const earliest = Math.max(predecessorEnd, phase ? Date.parse(phase.start!) + Number(operation.phase!.offsetMinutes) * 60000 : requested);
      if (predecessorEnd > requested) { row.waitingFor.push('poprzednik'); qualify('technology', operation.id, 'Żądany start poprzedza zakończenie poprzednika; przyjęto oczekiwanie.'); }
      const candidates = new Set([earliest]);
      for (const demand of demands) {
        for (const window of demand.resource!.availability) candidates.add(Math.max(earliest, Date.parse(window.start) - demand.offset));
        for (const reservation of result.reservations.filter(reservation => reservation.resourceId === demand.resource!.id)) candidates.add(Math.max(earliest, reservation.end - demand.offset));
      }
      const existingReservations = exactReservations.map(({ record, amount }) => ({ ...record, amount }));
      const canFit = (start: number) => demands.every(demand => {
        const segmentStart = start + demand.offset; const segmentEnd = segmentStart + demand.duration;
        if (!demand.resource!.availability.some(window => Date.parse(window.start) <= segmentStart && Date.parse(window.end) >= segmentEnd)) return false;
        const own = demands.filter(other => other.resource!.id === demand.resource!.id).map(other => ({ resourceId: other.resource!.id, operationId: operation.id, start: start + other.offset, end: start + other.offset + other.duration, amount: other.amount }));
        const reservations = [...existingReservations, ...own].filter(reservation => reservation.resourceId === demand.resource!.id && reservation.start < segmentEnd && reservation.end > segmentStart);
        const points = [segmentStart, ...reservations.map(reservation => Math.max(segmentStart, reservation.start))];
        return points.every(point => compare(reservations.filter(reservation => reservation.start <= point && reservation.end > point).reduce((sum, reservation) => add(sum, reservation.amount), ratio(0n)), decimal(known(demand.resource!.capacity)!)) <= 0n);
      });
      const start = [...candidates].sort((a, b) => a - b).find(candidate => candidate + Number(duration) * 60000 <= Date.parse(interval.end) && canFit(candidate));
      if (start === undefined) qualify(demands.some(demand => demand.resource!.kind === 'role') ? 'people' : 'machines', operation.id, 'Brak wspólnego przedziału dostępności.');
      else {
        const end = start + Number(duration) * 60000;
        row.start = new Date(start).toISOString(); row.end = new Date(end).toISOString(); row.elapsedMinutes = Number(duration); row.waitingMinutes = (start - requested) / 60000;
        row.deadlineMissed = end > Date.parse(operation.readyBy);
        row.minutesInside = Math.max(0, Math.min(end, Date.parse(interval.end)) - Math.max(start, Date.parse(interval.start))) / 60000;
        row.minutesBefore = Math.max(0, Math.min(end, Date.parse(interval.start)) - start) / 60000;
        if (start > earliest) row.waitingFor.push(...demands.map(demand => demand.resource!.id));
        if (phase && end > Date.parse(phase.end!)) qualify('technology', operation.id, 'Czynność nie mieści się w zadeklarowanym etapie pasywnym.');
        const window = known(operation.waitWindow);
        if (operation.predecessors.length && window === null) qualify('technology', operation.id, 'Brak właściwego okna technologicznego.');
        else if (window !== null && predecessors.length) {
          const wait = (start - Math.max(...predecessors.map(predecessor => Date.parse(predecessor.end!)))) / 60000;
          if (wait > Number(window)) qualify('technology', operation.id, `Przekroczenie okna o ${wait - Number(window)} min; źródło: ${operation.waitWindow.status !== 'missing' ? operation.waitWindow.source : ''}.`);
        }
        for (const demand of demands) {
          const record = { resourceId: demand.resource!.id, operationId: operation.id, start: start + demand.offset, end: start + demand.offset + demand.duration, amount: fixed(demand.amount, 9) };
          result.reservations.push(record); exactReservations.push({ record, amount: demand.amount });
          if (demand.resource!.kind === 'role') result.laborMinutes[demand.resource!.id] = (result.laborMinutes[demand.resource!.id] ?? 0) + demand.duration / 60000 * Number(demand.amount.numerator) / Number(demand.amount.denominator);
        }
      }
    }
    result.operations.push(row); completed.set(row.id, row);
  }
  return result;
}
