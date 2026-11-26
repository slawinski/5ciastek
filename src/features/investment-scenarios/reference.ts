import type { Evidence } from '@/features/investment-scenarios/values';
import type { ScenarioInput } from '@/features/investment-scenarios/schema';
import { upgradeScenario } from './upgrade';

export const sourced = (value: string, unit: string, period = 'day'): Evidence => ({ status: 'estimated', value, unit, source: 'Syntetyczny przykład SCN-AC-021', date: '2026-11-25', version: '1', period, context: 'Jawne założenie demonstracyjne' });
export const missing = (unit: string, reason = 'Brak danych'): Evidence => ({ status: 'missing', unit, reason });
export const at = (time: string) => `2026-11-25T${time}:00+01:00`;
export function scenarioFixture(publicationA = 1, publicationB = 2): ScenarioInput {
  const interval = { start: at('00:00'), end: '2026-11-26T00:00:00+01:00', zone: 'Europe/Warsaw' };
  const products = [{ id: 'A', publicationId: publicationA, target: 20, price: sourced('20', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced('0', '%'), readyOperationId: 'bake-A' },
    { id: 'B', publicationId: publicationB, target: 12, price: sourced('5', 'PLN/piece'), unitCost: sourced('2', 'PLN/piece'), lossPercent: sourced('0', '%'), readyOperationId: 'bake-B' }];
  return { schemaVersion: 1, name: 'Przykład A20/B12', period: 'day', interval, products,
    resources: [
      { id: 'baker', name: 'Właściciel-piekarz', kind: 'role', capacity: sourced('1', 'person'), unit: 'person', availability: [{ ...interval, start: at('05:00'), end: at('13:00') }], daysPerWeek: 5, hoursPerDay: 8, cost: missing('PLN', 'Wartość pracy właściciela nieuzgodniona') },
      { id: 'seller', name: 'Sprzedawca', kind: 'role', capacity: sourced('1', 'person'), unit: 'person', availability: [{ ...interval, start: at('07:00'), end: at('15:00') }], cost: sourced('80', 'PLN') },
      { id: 'oven', name: 'Piec', kind: 'equipment', capacity: sourced('20', 'piece'), unit: 'piece', availability: [interval], cost: sourced('0', 'PLN') },
    ],
    operations: products.flatMap((product, index) => {
      const context = { publicationId: product.publicationId, batch: { value: String(product.target), unit: 'piece' as const }, staff: 1, machine: 'oven', conditions: 'Syntetyczne warunki odniesienia' };
      return [{ id: `prep-${product.id}`, productId: product.id, step: 0, name: `Przygotowanie ${product.id}`, kind: 'active' as const,
        requestedStart: at(index ? '06:00' : '05:45'), readyBy: at('07:00'), priority: index * 2, duration: sourced('15', 'min'), context,
        predecessors: [], demands: [{ resourceId: 'baker', amount: sourced('1', 'person'), unit: 'person' as const, offsetMinutes: '0', duration: sourced('15', 'min') }], waitWindow: sourced('0', 'min') },
      { id: `bake-${product.id}`, productId: product.id, step: 0, name: `Wypiek ${product.id}`, kind: 'passive' as const,
        requestedStart: at(index ? '06:15' : '06:00'), readyBy: at('07:00'), priority: index * 2 + 1, duration: sourced(index ? '20' : '30', 'min'), context,
        predecessors: [`prep-${product.id}`], demands: [{ resourceId: 'oven', amount: sourced(String(product.target), 'piece'), unit: 'piece' as const, offsetMinutes: '0', duration: sourced(index ? '20' : '30', 'min') }], waitWindow: sourced('45', 'min') }];
    }),
    lots: products.map(product => ({ id: `lot-${product.id}`, productId: product.id, itemId: product.id, location: 'sklep', kind: 'finished', quantity: { value: String(product.target), unit: 'piece' },
      evidence: sourced(String(product.target), 'piece'), availableAt: at('06:00'), expiresAt: at('23:00'), admitted: true, admissionSource: 'Jawne dopuszczenie syntetyczne', sourceParts: [product.id], readyOperationId: `bake-${product.id}`, preparationContext: 'Wyprodukowano w badanym dniu' })),
    movements: products.map(product => ({ id: `sale-${product.id}`, lotId: `lot-${product.id}`, at: at('07:00'), kind: 'sale', quantity: { value: String(product.target), unit: 'piece' }, evidence: sourced(String(product.target), 'piece'), reason: 'Założenie sprzedaży całości, nie prognoza', admitted: true })),
    finance: { period: 'day', taxBasis: 'gross', costs: [
      { id: 'day', expenseId: 'day', name: 'Koszty dnia', category: 'fixed', basis: 'fixed', method: 'component', quantity: sourced('1', 'day'), rate: sourced('100', 'PLN/day'), taxBasis: 'gross', period: 'day', allocations: [] },
      { id: 'seller', expenseId: 'seller', name: 'Sprzedawca', category: 'labor', basis: 'fixed', method: 'pool', quantity: sourced('1', 'day'), rate: sourced('80', 'PLN/day'), taxBasis: 'gross', period: 'day', allocations: [] },
    ], requiredSales: { budget: missing('PLN'), period: 'day', mix: [] }, cashReceipts: missing('PLN'), cashPayments: missing('PLN'), ownerCharges: missing('PLN'), ownerValue: missing('PLN'), bottleneckMinutes: sourced('50', 'min') },
  };
}

export function weeklyFixture(publicationA = 1, publicationB = 2) {
  const input = upgradeScenario(scenarioFixture(publicationA, publicationB));
  input.name = 'Syntetyczny tydzień z WIP — uzupełnij źródła'; input.period = 'week'; input.finance.period = 'week';
  input.interval = { start: '2026-11-23T00:00:00+01:00', end: '2026-11-30T00:00:00+01:00', zone: 'Europe/Warsaw' };
  input.resources.forEach(resource => { resource.availability = [input.interval]; });
  const stage = input.operations.find(operation => operation.id === 'prep-A')!;
  stage.kind = 'passive'; stage.requestedStart = '2026-11-22T22:00:00+01:00'; stage.duration = sourced('480', 'min', 'week'); stage.demands = [];
  const bake = input.operations.find(operation => operation.id === 'bake-A')!; bake.requestedStart = '2026-11-23T06:00:00+01:00'; bake.readyBy = '2026-11-23T07:00:00+01:00';
  input.lots[0].availableAt = bake.requestedStart;
  input.movements[0].at = '2026-11-23T07:00:00+01:00';
  input.openingWip = [{ id: 'sunday-wip', batchId: 'batch:A', operationId: stage.id, startedAt: stage.requestedStart, quantity: { value: '20', unit: 'piece' }, evidence: sourced('20', 'piece', 'week'), priorLabor: missing('person-min'), priorCost: missing('PLN'), coverage: [{ ingredientId: 1, quantity: { value: '10000', unit: 'g' }, evidence: sourced('10000', 'g', 'week') }] }];
  input.lots.push({ id: 'flour-opening', itemId: '1', location: 'magazyn', kind: 'material', quantity: { value: '20000', unit: 'g' }, evidence: sourced('20000', 'g', 'week'), availableAt: input.interval.start, expiresAt: input.interval.end, admitted: true, admissionSource: 'Syntetyczne dopuszczenie', sourceParts: ['manual-opening'], preparationContext: 'Źródłowy stan otwarcia' });
  // Day-scoped costs remain visibly unaligned until the owner supplies weekly costs.
  return input;
}
