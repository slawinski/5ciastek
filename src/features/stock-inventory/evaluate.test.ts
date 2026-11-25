import { describe, it, expect } from 'vitest';
import { evaluateStock } from './evaluate';
import { scenarioFixture, at, sourced } from '@/tests/fixtures/investment-scenarios';
import { evaluateProcess } from '../process-execution/evaluate';

describe('isolated time-dependent stock', () => {
  it('does not sell before readiness, and reports supported sales only', () => {
    const input = scenarioFixture(); input.movements[0].at = at('05:00');
    const result = evaluateStock(input.lots, input.movements, evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.sales.A ?? '0').toBe('0'); expect(result.unmet[0].quantity).toBe('20');
    expect(result.sales.B).toBe('12');
  });
  it('counts identical movements once and rejects conflicting identities', () => {
    const input = scenarioFixture(); input.movements.push(structuredClone(input.movements[0]));
    const process = evaluateProcess(input.operations, input.resources, input.interval);
    expect(evaluateStock(input.lots, input.movements, process).sales.A).toBe('20');
    input.movements[2].quantity.value = '1';
    expect(() => evaluateStock(input.lots, input.movements, process)).toThrow(/tożsamość/);
  });
  it('preserves zero, unknown opening and atomic over-issue in exact grams', () => {
    const input = scenarioFixture(); const lot = { ...input.lots[0], kind: 'material' as const, quantity: { value: '20000', unit: 'g' as const }, readyOperationId: undefined };
    const movement = { ...input.movements[0], kind: 'consume' as const, quantity: { value: '19500', unit: 'g' as const } };
    const loss = { ...movement, id: 'loss', at: at('07:01'), kind: 'loss' as const, quantity: { value: '500', unit: 'g' as const }, reason: 'Rozlanie' };
    const over = { ...movement, id: 'over', at: at('07:02'), quantity: { value: '1000', unit: 'g' as const } };
    const process = evaluateProcess(input.operations, input.resources, input.interval);
    const result = evaluateStock([lot], [movement, loss, over], process);
    expect(result.lots[0].physical).toBe('0'); expect(result.unmet[0].quantity).toBe('1000');
    expect(evaluateStock([{ ...lot, quantity: null }], [movement], process).lots[0].physical).toBeNull();
  });
  it('keeps inadmissible returns physical and refunds quantity-neutral', () => {
    const input = scenarioFixture();
    const returned = { ...input.movements[0], id: 'return', kind: 'return' as const, admitted: false, quantity: { value: '2', unit: 'piece' as const } };
    const result = evaluateStock(input.lots, [returned, { ...returned, id: 'refund', kind: 'refund' }], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.lots[0]).toMatchObject({ physical: '22', saleable: '20' });
  });
  it('does not turn excess, expired or inadmissible quantities into revenue', () => {
    const input = scenarioFixture(); input.movements[0].quantity.value = '30';
    const process = evaluateProcess(input.operations, input.resources, input.interval);
    const result = evaluateStock(input.lots, input.movements, process);
    expect(result.sales.A).toBe('20'); expect(result.unmet[0].quantity).toBe('10');
    input.lots[0].expiresAt = at('06:00');
    expect(evaluateStock(input.lots, input.movements, process).sales.A).toBeUndefined();
    expect(evaluateStock(input.lots, input.movements, process).readyPieces.A).toBeUndefined();
  });
  it('conserves transferred parts without admitting non-saleable source stock', () => {
    const input = scenarioFixture();
    const source = { ...input.lots[0], admitted: false };
    const target = { ...input.lots[0], id: 'target', quantity: { value: '0', unit: 'piece' as const }, sourceParts: ['target-opening'] };
    const transfer = { ...input.movements[0], kind: 'transfer' as const, targetLotId: 'target', quantity: { value: '12', unit: 'piece' as const } };
    const result = evaluateStock([source, target], [transfer], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.lots[0].physical).toBe('8');
    expect(result.lots[1]).toMatchObject({ physical: '12', saleable: '0', sourceParts: ['target-opening', 'A'] });
  });
  it('uses an entered yield conversion without selling mass as pieces', () => {
    const input = scenarioFixture(); const process = evaluateProcess(input.operations, input.resources, input.interval);
    const lot = { ...input.lots[0], quantity: { value: '1000', unit: 'g' as const } };
    const sale = { ...input.movements[0], quantity: { value: '12', unit: 'piece' as const }, conversion: { from: { value: '1', unit: 'piece' as const }, to: { value: '100', unit: 'g' as const }, evidence: sourced('100', 'g/piece') } };
    const result = evaluateStock([lot], [sale], process);
    expect(result.sales.A).toBe('10'); expect(result.unmet[0].quantity).toBe('2'); expect(result.lots[0].physical).toBe('0');
  });
});
