import { expect, it } from 'vitest';
import { at, missing, sourced } from '@/tests/fixtures/investment-scenarios';
import { monthlyFixture } from '@/tests/fixtures/investment-month';
import { freezeRecipe } from '../recipes/publication';
import { evaluateScenarioV2 } from '../investment-scenarios/evaluate-v2';
import { monthReportSchema } from './month';

it('maps 22 calendar days and reconciles qualified post-owner cash independently', () => {
  const result = evaluateScenarioV2(monthlyFixture());
  expect(result.monthly?.sold).toEqual({ A: '2200' });
  expect(result.monthly?.variableCost.value).toBe('22000.00');
  expect(result.monthly?.fixedCost.value).toBe('8000.00');
  expect(result.monthly?.repeatability.status).toBe('qualified');
  expect(result.monthly?.recurringCash).toMatchObject({ status: 'qualified', value: '2000.00' });
  expect(monthReportSchema.safeParse(result.monthly).success).toBe(true);
});

it('does not replenish opening stock implicitly on mapped sales-only days', () => {
  const saved = monthlyFixture(); const month = saved.input.month!;
  month.calendar.forEach(row => { row.productionProfile = null; });
  const { batchId: _batchId, ...opening } = saved.input.lots[0];
  void _batchId;
  month.openingLots = [{ ...opening, readyOperationId: undefined, quantity: { value: '100', unit: 'piece' }, availableAt: '2026-11-01T00:00:00+01:00', expiresAt: '2026-12-01T00:00:00+01:00' }];
  const result = evaluateScenarioV2(saved);
  expect(result.monthly?.sold.A).toBe('100');
  expect(result.monthly?.repeatability.status).toBe('unverified');
  expect(result.monthly?.recurringCash.value).toBeNull();
});

it('keeps contribution when rent or owner charges are missing and rejects overlapping payment inclusion', () => {
  const saved = monthlyFixture(); saved.input.month!.fixedCosts[0].amount = missing('PLN');
  let result = evaluateScenarioV2(saved);
  expect(result.monthly?.contribution.value).toBe('22000.00');
  expect(result.monthly?.ownerNet.status).toBe('unverified');
  saved.input.month!.fixedCosts[0].amount = sourced('4000', 'PLN', '2026-11');
  saved.input.month!.cashEntries.push({ ...saved.input.month!.cashEntries[1], id: 'duplicate', expenseId: 'duplicate' });
  result = evaluateScenarioV2(saved);
  expect(result.monthly?.recurringCash.status).toBe('unverified');
});

it('preserves overnight offsets for readiness and expiry instead of moving completion before consumption', () => {
  const saved = monthlyFixture(); const { input } = saved; const month = input.month!;
  input.interval.end = '2026-11-27T00:00:00+01:00';
  input.resources.forEach(row => { row.availability = [input.interval]; });
  input.operations[0].requestedStart = at('23:45'); input.operations[0].readyBy = '2026-11-26T01:00:00+01:00';
  input.operations[1].requestedStart = '2026-11-26T00:00:00+01:00'; input.operations[1].readyBy = '2026-11-26T01:00:00+01:00';
  input.lots[0].availableAt = input.operations[1].requestedStart; input.lots[0].expiresAt = '2026-11-27T00:30:00+01:00';
  input.movements[0].at = '2026-11-26T01:00:00+01:00';
  month.calendar = [
    { ...month.calendar[0], productionProfile: '2026-11-25', salesProfile: null },
    { ...month.calendar[1], productionProfile: null, salesProfile: '2026-11-26' },
  ];
  expect(evaluateScenarioV2(saved).monthly?.sold).toEqual({ A: '100' });
  input.lots[0].expiresAt = '2026-11-26T00:30:00+01:00';
  expect(evaluateScenarioV2(saved).monthly?.sold).toEqual({ A: '0' });
});

function unequalStockFixture() {
  const saved = monthlyFixture(); const month = saved.input.month!;
  saved.publications[0].snapshot = freezeRecipe({ name: 'A', yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '100' }] });
  month.calendar = [month.calendar[0]];
  month.openingLots[0].quantity!.value = '10000';
  const template = month.preparations[0];
  month.preparations = [
    { ...template, id: 'six', expenseId: 'six', quantity: { value: '6000', unit: 'g' }, materialCost: sourced('24', 'PLN', month.period), coveredMovementIds: [] },
    { ...template, id: 'four', expenseId: 'four', quantity: { value: '4000', unit: 'g' }, readyAt: '2026-12-01T00:00:00+01:00', materialCost: sourced('16', 'PLN', month.period), laborRate: sourced('60', 'PLN/person-hour', month.period), coveredMovementIds: [],
      operations: [{ ...template.operations[0], requestedStart: '2026-11-30T23:40:00+01:00', readyBy: '2026-12-01T00:00:00+01:00', duration: sourced('20', 'min'), demands: [{ resourceId: 'outside-baker', amount: sourced('1', 'person'), unit: 'person', offsetMinutes: '0', duration: sourced('20', 'min') }] }],
      resources: [{ ...saved.input.resources[0], id: 'outside-baker', availability: [{ zone: saved.input.interval.zone, start: '2026-11-30T23:40:00+01:00', end: '2026-12-01T00:00:00+01:00' }] }],
    },
  ];
  return saved;
}

it('qualifies 10 to 6 stock with sourced feasible net replenishment, counting 16 + 20 once', () => {
  const result = evaluateScenarioV2(unequalStockFixture()).monthly!;
  expect(result.boundaryStock.find(row => row.itemId === '1')).toMatchObject({ opening: '10000', closing: '6000' });
  expect(result.repeatability).toMatchObject({ status: 'qualified', reasons: [] });
  expect(result.ledger.filter(row => row.expenseId === 'four')).toMatchObject([{ amount: '36.00' }]);
  expect(result.variableCost.value).toBe('1060.00');
  expect(result.laborMinutes['outside-baker']).toBe(20);
});

it('rejects preparation resource conflicts, unknown labor and expired replenishment', () => {
  const saved = unequalStockFixture(); const prep = saved.input.month!.preparations[1];
  prep.resources[0].availability = [];
  expect(evaluateScenarioV2(saved).monthly?.repeatability.status).toBe('unverified');
  prep.laborRate = missing('PLN/person-hour');
  expect(evaluateScenarioV2(saved).monthly?.variableCost.status).toBe('unverified');
  const expired = unequalStockFixture(); expired.input.month!.preparations[1].expiresAt = '2026-11-30T00:00:00+01:00';
  expect(evaluateScenarioV2(expired).monthly?.repeatability.status).toBe('unverified');
});

it('checks preparation reservations against each other and mapped production', () => {
  const saved = unequalStockFixture(); const month = saved.input.month!;
  month.preparations.push({ ...structuredClone(month.preparations[1]), id: 'overlap', expenseId: 'overlap' });
  expect(evaluateScenarioV2(saved).monthly?.repeatability.status).toBe('unverified');
  const mapped = monthlyFixture(); const prep = mapped.input.month!.preparations[0];
  prep.readyAt = '2026-11-01T06:00:00+01:00';
  prep.operations[0] = { ...prep.operations[0], requestedStart: '2026-11-01T05:45:00+01:00', readyBy: prep.readyAt, duration: sourced('15', 'min'), demands: structuredClone(mapped.input.operations[0].demands) };
  prep.resources = [{ ...mapped.input.resources[0], availability: [{ zone: mapped.input.interval.zone, start: '2026-11-01T05:00:00+01:00', end: '2026-11-01T13:00:00+01:00' }] }];
  expect(evaluateScenarioV2(mapped).monthly?.repeatability.status).toBe('unverified');
});

it('never counts repeated cash identities as separate receipts', () => {
  const saved = monthlyFixture(); const month = saved.input.month!;
  month.cashEntries[0].amount = sourced('20000', 'PLN', month.period);
  month.cashEntries.push({ ...month.cashEntries[0], id: 'same-receipt' });
  expect(evaluateScenarioV2(saved).monthly?.recurringCash.status).toBe('unverified');
});

it('excludes expired month-opening stock from supported sales', () => {
  const saved = monthlyFixture(); const month = saved.input.month!;
  month.openingLots[0].expiresAt = '2026-11-01T05:00:00+01:00';
  expect(evaluateScenarioV2(saved).monthly?.sold.A).toBe('0');
});

it('carries sourced prior WIP labor and cost once and leaves unknown preparation unverified', () => {
  const saved = monthlyFixture(); const { input } = saved; const month = input.month!;
  input.interval.start = '2026-11-24T23:30:00+01:00';
  input.operations[0].requestedStart = '2026-11-24T23:00:00+01:00';
  input.operations[0].duration = sourced('420', 'min'); input.operations[0].demands = [];
  input.openingWip = [{ id: 'prior', batchId: 'batch:A', operationId: input.operations[0].id, startedAt: input.operations[0].requestedStart, quantity: { value: '100', unit: 'piece' }, evidence: sourced('100', 'piece'), priorLabor: sourced('20', 'person-min'), priorCost: sourced('36', 'PLN'), coverage: [{ ingredientId: 1, quantity: { value: '50000', unit: 'g' }, evidence: sourced('50000', 'g') }] }];
  input.products[0].unitCost = sourced('0', 'PLN/piece');
  month.calendar = [{ ...month.calendar[0], productionProfile: '2026-11-24', salesProfile: null }, { ...month.calendar[1], productionProfile: null, salesProfile: '2026-11-25' }];
  month.openingLots = [{ ...month.openingLots[0], id: 'prior-lot', itemId: 'wip:prior', quantity: { value: '100', unit: 'piece' } }];
  const preparation = month.preparations[0];
  month.preparations = [{ ...preparation, expenseId: 'wip:prior', itemId: 'wip:prior', quantity: { value: '100', unit: 'piece' }, materialCost: sourced('36', 'PLN', month.period), coveredMovementIds: ['wip:prior'] }];
  const result = evaluateScenarioV2(saved);
  expect(result.monthly?.sold.A).toBe('100');
  expect(result.monthly?.variableCost.value).toBe('36.00');
  expect(result.monthly?.laborMinutes['prior:prior']).toBe(20);
  expect(result.monthly?.ledger.filter(row => row.expenseId === 'wip:prior')).toHaveLength(1);
  input.openingWip[0].priorLabor = missing('person-min');
  expect(evaluateScenarioV2(saved).monthly?.repeatability.status).toBe('unverified');
  input.openingWip[0].priorCost = missing('PLN');
  expect(evaluateScenarioV2(saved).monthly?.variableCost.status).toBe('unverified');
});

it('compares required monthly sales with supported monthly capacity and keeps owner value separate', () => {
  const saved = monthlyFixture();
  saved.input.finance.requiredSales = { period: '2026-11', budget: sourced('24000', 'PLN', '2026-11'), mix: [{ productId: 'A', soldPieces: 1, price: sourced('20', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced('0', '%') }] };
  saved.input.month!.ownerEconomicValue = sourced('5000', 'PLN', '2026-11');
  let result = evaluateScenarioV2(saved).monthly!;
  expect(result.requiredSales.sold).toEqual({ A: '2400' });
  expect(result.comparison.A).toMatchObject({ ready: '2200', required: '2400', deficit: '200' });
  expect(result.ownerEconomicValue.value).toBe('5000.00');
  expect(result.recurringCash.value).toBe('2000.00');
  saved.input.movements[0].quantity.value = '50';
  result = evaluateScenarioV2(saved).monthly!;
  expect(result.sold.A).toBe('1100');
  expect(result.comparison.A.ready).toBe('2200');
  saved.input.finance.requiredSales.period = 'day';
  result = evaluateScenarioV2(saved).monthly!;
  expect(result.requiredSales.status).toBe('unverified');
  expect(result.comparison).toEqual({});
});

it('maps production-only and sales-only dates separately without multiplying monthly preparations', () => {
  const saved = monthlyFixture(); const month = saved.input.month!;
  month.calendar = [
    { ...month.calendar[0], salesProfile: null },
    { ...month.calendar[1], productionProfile: null },
  ];
  saved.input.lots[0].expiresAt = '2026-11-27T00:00:00+01:00';
  const result = evaluateScenarioV2(saved).monthly!;
  expect(result).toMatchObject({ productionDays: 1, salesDays: 1, produced: { A: '100' }, sold: { A: '100' }, fixedCost: { value: '8000.00' } });
  expect(result.laborMinutes.baker).toBe(15);
});

it('uses dated replenishment only for subsequent eligible sales, never earlier shortages', () => {
  const saved = monthlyFixture(); const month = saved.input.month!;
  month.calendar.forEach(row => { row.productionProfile = null; });
  const { batchId: _batch, readyOperationId: _ready, ...lot } = saved.input.lots[0];
  void _batch; void _ready;
  month.openingLots = [{ ...lot, availableAt: '2026-11-01T00:00:00+01:00', expiresAt: '2026-12-01T00:00:00+01:00' }];
  const prep = month.preparations[0];
  month.preparations = [{ ...prep, id: 'later', expenseId: 'later', itemId: 'A', quantity: { value: '100', unit: 'piece' }, readyAt: '2026-11-03T06:00:00+01:00', expiresAt: '2026-11-03T08:00:00+01:00', materialCost: sourced('1000', 'PLN', month.period), coveredMovementIds: [], operations: [{ ...prep.operations[0], requestedStart: '2026-11-03T05:59:00+01:00', readyBy: '2026-11-03T06:00:00+01:00' }] }];
  const result = evaluateScenarioV2(saved).monthly!;
  expect(result.sold.A).toBe('200');
  expect(result.repeatability.status).toBe('unverified');
  expect(result.ledger.filter(row => row.expenseId === 'later')).toMatchObject([{ amount: '1000.00', evidence: [prep.evidence, sourced('1000', 'PLN', month.period), prep.laborRate] }]);
});

it('rejects late boundary replacement and missing owner charges without erasing contribution', () => {
  const saved = unequalStockFixture();
  saved.input.month!.preparations[1].readyAt = '2026-12-02T00:00:00+01:00';
  expect(evaluateScenarioV2(saved).monthly?.repeatability.status).toBe('unverified');
  const missingCharges = monthlyFixture(); missingCharges.input.month!.ownerCharges = missing('PLN');
  const result = evaluateScenarioV2(missingCharges).monthly!;
  expect(result.contribution.value).toBe('22000.00');
  expect(result.ownerNet.status).toBe('unverified');
  expect(result.recurringCash.status).toBe('unverified');
});

it('keeps accrual owner-net independent from a missing cash income provision', () => {
  const saved = monthlyFixture(); saved.input.month!.ownerIncome = missing('PLN');
  const result = evaluateScenarioV2(saved).monthly!;
  expect(result.ownerNet).toMatchObject({ status: 'qualified', value: '12000.00' });
  expect(result.recurringCash.status).toBe('unverified');
});

it('scales exact source costs before money rounding', () => {
  const saved = monthlyFixture();
  saved.input.finance.costs.push({ id: 'small', expenseId: 'small', name: 'Koszt źródłowy', category: 'batch', basis: 'variable', method: 'component', productId: 'A', quantity: sourced('1', 'g'), rate: sourced('0.001', 'PLN/g'), taxBasis: 'gross', period: 'day', allocations: [] });
  expect(evaluateScenarioV2(saved).monthly?.variableCost.value).toBe('22000.02');
});

it('preserves separate readiness lots and their expiry within a mapped batch', () => {
  const saved = monthlyFixture(); const lot = saved.input.lots[0];
  lot.quantity!.value = '50'; lot.expiresAt = at('06:45');
  saved.input.lots.push({ ...structuredClone(lot), id: 'late', expiresAt: at('23:00') });
  saved.input.movements[0].quantity.value = '50';
  saved.input.movements.push({ ...structuredClone(saved.input.movements[0]), id: 'sale-late', lotId: 'late' });
  expect(evaluateScenarioV2(saved).monthly?.sold.A).toBe('1100');
});
