import { describe, it, expect } from 'vitest';
import { evaluateProcess } from './evaluate';
import { scenarioFixture, sourced, missing, at } from '@/tests/fixtures/investment-scenarios';

describe('supplied process order', () => {
  it('shares the oven, waits fifteen minutes, counts active labor only', () => {
    const input = scenarioFixture(); const result = evaluateProcess(input.operations, input.resources, input.interval);
    expect(result.operations.find(operation => operation.id === 'bake-B')).toMatchObject({ start: new Date(at('06:30')).toISOString(), end: new Date(at('06:50')).toISOString(), waitingMinutes: 15 });
    expect(result.laborMinutes.baker).toBe(30);
    expect(evaluateProcess([...input.operations].reverse(), input.resources, input.interval)).toEqual(result);
  });
  it('does not invent capacity or split oversized loads', () => {
    const input = scenarioFixture(); input.operations[1].demands[0].amount = sourced('21', 'piece');
    expect(evaluateProcess(input.operations, input.resources, input.interval).operations.find(operation => operation.id === 'bake-A')?.end).toBeNull();
    input.resources[2].capacity = missing('piece');
    expect(evaluateProcess(input.operations, input.resources, input.interval).qualifications.some(reason => reason.domain === 'machines')).toBe(true);
  });
  it('reserves simultaneous labor independently of a seller', () => {
    const input = scenarioFixture(); input.operations[2].requestedStart = input.operations[0].requestedStart;
    const result = evaluateProcess(input.operations, input.resources, input.interval);
    expect(result.operations.find(operation => operation.id === 'prep-B')?.waitingMinutes).toBe(15);
  });
  it('keeps a passive phase and flags a child that cannot fit', () => {
    const input = scenarioFixture(); input.operations = [input.operations[0], { ...input.operations[0], id: 'phase', kind: 'passive', duration: sourced('45', 'min'), demands: [], priority: 0 },
      { ...input.operations[0], id: 'child', duration: sourced('5', 'min'), phase: { id: 'phase', offsetMinutes: '44' }, priority: 1, demands: [] }];
    const result = evaluateProcess(input.operations, input.resources, input.interval);
    expect(result.operations.find(operation => operation.id === 'phase')?.elapsedMinutes).toBe(45);
    expect(result.qualifications.some(reason => reason.identity === 'child')).toBe(true);
  });
  it('accepts equality at a wait limit and qualifies a missing window separately', () => {
    const input = scenarioFixture(); input.operations[3].waitWindow = sourced('15', 'min');
    expect(evaluateProcess(input.operations, input.resources, input.interval).qualifications.filter(reason => reason.identity === 'bake-B')).toEqual([]);
    input.operations[3].waitWindow = sourced('0', 'min');
    expect(evaluateProcess(input.operations, input.resources, input.interval).qualifications.some(reason => reason.reason.includes('15 min'))).toBe(true);
    input.operations[3].waitWindow = missing('min');
    const result = evaluateProcess(input.operations, input.resources, input.interval);
    expect(result.operations.find(operation => operation.id === 'bake-B')?.end).not.toBeNull();
    expect(result.qualifications.some(reason => reason.domain === 'technology')).toBe(true);
  });
  it('keeps labor segments distinct and preserves a cross-midnight passive start', () => {
    const input = scenarioFixture(); input.resources[0].capacity = sourced('2', 'person');
    input.operations[0].duration = sourced('30', 'min');
    input.operations[0].demands = [{ ...input.operations[0].demands[0], duration: sourced('10', 'min') }, { ...input.operations[0].demands[0], offsetMinutes: '10', duration: sourced('20', 'min'), amount: sourced('2', 'person') }];
    input.operations = [input.operations[0], { ...input.operations[1], requestedStart: '2026-11-24T23:00:00+01:00', duration: sourced('420', 'min'), predecessors: [], demands: [] }];
    const result = evaluateProcess(input.operations, input.resources, input.interval);
    expect(result.laborMinutes.baker).toBe(50);
    expect(result.operations.find(operation => operation.id === 'bake-A')).toMatchObject({ minutesBefore: 60, minutesInside: 360, elapsedMinutes: 420 });
  });
  it('requires sourced yield conversion before comparing mass with pieces', () => {
    const input = scenarioFixture(); input.resources[2].unit = 'g'; input.resources[2].capacity = sourced('10000', 'g');
    expect(evaluateProcess(input.operations, input.resources, input.interval).operations.find(operation => operation.id === 'bake-A')?.end).toBeNull();
    input.operations[1].demands[0].conversion = { from: { value: '1', unit: 'piece' }, to: { value: '500', unit: 'g' }, evidence: sourced('500', 'g/piece') };
    expect(evaluateProcess(input.operations, input.resources, input.interval).operations.find(operation => operation.id === 'bake-A')?.end).not.toBeNull();
    input.resources[2].capacity = sourced('0.333333333', 'g');
    input.operations[1].demands[0].amount = sourced('1', 'piece');
    input.operations[1].demands[0].conversion = { from: { value: '3', unit: 'piece' }, to: { value: '1', unit: 'g' }, evidence: sourced('1', 'g/3piece') };
    expect(evaluateProcess(input.operations, input.resources, input.interval).operations.find(operation => operation.id === 'bake-A')?.end).toBeNull();
  });
});
