import { describe, expect, it } from 'vitest';
import { money, decimal, times } from './money';
import { requiredSales } from './required-sales';
import { sourced } from '@/tests/fixtures/investment-scenarios';
import { scenarioFixture, missing } from '@/tests/fixtures/investment-scenarios';
import { evaluateEconomics } from './evaluate';
import { evaluateProcess } from '../process-execution/evaluate';
import { evaluateStock } from '../stock-inventory/evaluate';

describe('exact economic boundaries', () => {
  it('rounds signed half cents symmetrically without float arithmetic', () => {
    expect(money(decimal('1.005'))).toBe('1.01');
    expect(money(decimal('-1.005'))).toBe('-1.01');
    expect(money(times(decimal('0.1'), decimal('0.2')))).toBe('0.02');
  });
  it('derives required pieces and revenue for a sourced budget', () => {
    const result = requiredSales({ period: 'month', budget: sourced('24000', 'PLN', 'month'), mix: [{ productId: 'A', soldPieces: 1, price: sourced('20', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced('0', '%') }] });
    expect(result).toMatchObject({ sold: { A: '2400' }, produced: { A: '2400' }, revenue: '48000.00', variableCost: '24000.00' });
  });
  it('uses sold mix and produces losses without generating revenue from waste', () => {
    const result = requiredSales({ period: 'day', budget: sourced('2200', 'PLN'), mix: [
      { productId: 'A', soldPieces: 1, price: sourced('20', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced('0', '%') },
      { productId: 'B', soldPieces: 1, price: sourced('30', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced('20', '%') },
    ] });
    expect(result).toMatchObject({ sold: { A: '80', B: '80' }, produced: { A: '80', B: '100' }, revenue: '4000.00', variableCost: '1800.00', contribution: '2200.00' });
  });
  it('does not divide by zero or declare finite sales from nonpositive contribution', () => {
    for (const loss of ['0', '100']) expect(requiredSales({ period: 'day', budget: sourced('1', 'PLN'), mix: [{ productId: 'A', soldPieces: 1, price: sourced('10', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced(loss, '%') }] }).status).toBe('no-finite-solution');
  });
  it('recomputes budget coverage after non-divisible whole-piece production rounding', () => {
    const result = requiredSales({ period: 'day', budget: sourced('1', 'PLN'), mix: [{ productId: 'A', soldPieces: 1, price: sourced('20', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced('20', '%') }] });
    expect(result).toMatchObject({ status: 'calculated', sold: { A: '2' }, produced: { A: '3' }, revenue: '40.00', variableCost: '30.00', contribution: '10.00' });
  });
});

it.each([
  ['2', 'kg', '3', 'PLN/g', '6000.00'], ['10000', 'g', '4', 'PLN/kg', '40.00'],
  ['30', 'person-min', '60', 'PLN/person-hour', '30.00'], ['2', 'person-hour', '3', 'PLN/person-min', '360.00'],
  ['90', 'min', '2', 'PLN/hour', '3.00'], ['1.5', 'hour', '0.1', 'PLN/min', '9.00'],
  ['0.1', 'kg', '0.00015', 'PLN/g', '0.02'],
])('normalizes %s %s at %s %s exactly', (quantity, unit, rate, rateUnit, expected) => {
  const input = scenarioFixture(); input.finance.costs = [{ ...input.finance.costs[0], quantity: sourced(quantity, unit), rate: sourced(rate, rateUnit) }];
  const process = evaluateProcess(input.operations, input.resources, input.interval); const stock = evaluateStock(input.lots, input.movements, process);
  expect(evaluateEconomics({ input, publications: [] }, stock, process)).toMatchObject({ fixedCost: expected, costs: [{ amount: expected }] });
});

it.each(['fixed', 'variable', 'product'] as const)('qualifies incompatible cost dimensions and preserves independent outcomes (%s)', basis => {
  const input = scenarioFixture();
  input.finance.costs = [{ ...input.finance.costs[0], basis, productId: basis === 'product' ? 'A' : undefined, quantity: sourced('2', 'kg'), rate: sourced('3', 'PLN/kWh') }];
  if (basis === 'product') input.products[0].unitCost = missing('PLN/piece');
  input.finance.cashReceipts = sourced('180', 'PLN'); input.finance.cashPayments = sourced('130', 'PLN');
  const process = evaluateProcess(input.operations, input.resources, input.interval); const stock = evaluateStock(input.lots, input.movements, process);
  const report = evaluateEconomics({ input, publications: [] }, stock, process);
  expect(report).toMatchObject({ revenue: '460.00', cashSurplus: '50.00', operatingRemainder: null, costs: [{ amount: null }] });
  expect(report.qualifications).toContainEqual(expect.objectContaining({ identity: 'day', reason: expect.stringContaining('jednost') }));
  expect(report.contribution).toBe(basis === 'fixed' ? '236.00' : null);
  expect(report.knownContribution).toBe(basis === 'product' ? '436.00' : '236.00');
});

it.each([
  ['cashReceipts', 'PLN', 'month'], ['cashPayments', 'PLN', 'month'],
  ['cashReceipts', 'EUR', 'day'], ['cashPayments', 'EUR', 'day'],
] as const)('qualifies %s unit/period independently of operating contribution', (field, unit, period) => {
  const input = scenarioFixture(); input.finance.cashReceipts = sourced('180', 'PLN'); input.finance.cashPayments = sourced('130', 'PLN');
  input.finance[field] = sourced(field === 'cashReceipts' ? '180' : '130', unit, period);
  const process = evaluateProcess(input.operations, input.resources, input.interval); const stock = evaluateStock(input.lots, input.movements, process);
  const report = evaluateEconomics({ input, publications: [] }, stock, process);
  expect(report).toMatchObject({ cashSurplus: null, contribution: '236.00', operatingRemainder: '56.00' });
  expect(report.qualifications).toContainEqual(expect.objectContaining({ identity: field }));
});

it('qualifies both cash inputs against the finance period even when scenario periods match', () => {
  const input = scenarioFixture(); input.finance.period = 'month';
  input.finance.cashReceipts = sourced('180', 'PLN'); input.finance.cashPayments = sourced('130', 'PLN');
  const process = evaluateProcess(input.operations, input.resources, input.interval); const stock = evaluateStock(input.lots, input.movements, process);
  const report = evaluateEconomics({ input, publications: [] }, stock, process);
  expect(report.cashSurplus).toBeNull();
  for (const identity of ['cashReceipts', 'cashPayments']) expect(report.qualifications).toContainEqual(expect.objectContaining({ identity }));
});

it('separates gross margin, contribution, operating remainder and cash', () => {
  const input = scenarioFixture(); input.products[0].target = 10; input.products[0].unitCost = sourced('6', 'PLN/piece'); input.products = [input.products[0]];
  input.lots = [{ ...input.lots[0], quantity: { value: '10', unit: 'piece' } }]; input.movements = [{ ...input.movements[0], quantity: { value: '10', unit: 'piece' } }];
  input.finance.costs = [{ ...input.finance.costs[0], basis: 'variable', rate: sourced('40', 'PLN/day') }, { ...input.finance.costs[1], rate: sourced('50', 'PLN/day') }];
  input.finance.cashReceipts = sourced('180', 'PLN'); input.finance.cashPayments = sourced('130', 'PLN');
  const process = evaluateProcess(input.operations, input.resources, input.interval); const stock = evaluateStock(input.lots, input.movements, process);
  expect(evaluateEconomics({ input, publications: [] }, stock, process)).toMatchObject({ grossMargin: '140.00', contribution: '100.00', operatingRemainder: '50.00', cashSurplus: '50.00' });
  input.finance.costs[1].rate = missing('PLN/day');
  expect(evaluateEconomics({ input, publications: [] }, stock, process)).toMatchObject({ contribution: '100.00', operatingRemainder: null });
});

it('allocates one labor pool and normalizes exact ingredient/energy dimensions', () => {
  const input = scenarioFixture(); input.products.forEach(product => { product.unitCost = sourced('0', 'PLN/piece'); });
  input.finance.costs = [{ ...input.finance.costs[0], id: 'labor', category: 'labor', basis: 'variable', method: 'pool', quantity: sourced('30', 'person-min'), rate: sourced('60', 'PLN/person-hour'), allocations: [{ productId: 'A', share: '0.5' }, { productId: 'B', share: '0.5' }] }];
  const process = evaluateProcess(input.operations, input.resources, input.interval); const stock = evaluateStock(input.lots, input.movements, process);
  const report = evaluateEconomics({ input, publications: [] }, stock, process);
  expect(report.costs[0]).toMatchObject({ amount: '30.00', allocations: [{ amount: '15.00', quantity: '15.00' }, { amount: '15.00', quantity: '15.00' }] });
  input.finance.costs = [
    { ...input.finance.costs[0], id: 'ingredient', expenseId: 'ingredient', category: 'ingredient', method: 'component', quantity: sourced('10000', 'g'), rate: sourced('4', 'PLN/kg'), allocations: [] },
    { ...input.finance.costs[0], id: 'packaging', expenseId: 'packaging', category: 'packaging', method: 'component', quantity: sourced('1', 'batch'), rate: sourced('5', 'PLN/batch'), allocations: [] },
    { ...input.finance.costs[0], id: 'energy', expenseId: 'energy', category: 'energy', method: 'component', quantity: sourced('2', 'kWh'), rate: sourced('1', 'PLN/kWh'), allocations: [] },
  ];
  expect(evaluateEconomics({ input, publications: [] }, stock, process).variableCost).toBe('47.00');
  input.finance.costs[0].taxBasis = 'net';
  expect(evaluateEconomics({ input, publications: [] }, stock, process).contribution).toBeNull();
  expect(evaluateEconomics({ input, publications: [] }, stock, process).contributionPerPiece).toBeNull();
  input.finance.costs = [];
  expect(evaluateEconomics({ input, publications: [] }, stock, process).operatingRemainder).toBeNull();
});
