import { describe, expect, it } from 'vitest';
import { scenarioFixture, sourced, missing } from '@/tests/fixtures/investment-scenarios';
import { upgradeScenario } from '../investment-scenarios/upgrade';
import { evaluateWeek } from './week';

describe('weekly process continuation', () => {
  it('attributes fixed opening-WIP reservation failures to each failing resource domain', () => {
    for (const failed of [['baker'], ['oven'], ['baker', 'oven']]) {
      const input = upgradeScenario(scenarioFixture()); const operation = input.operations[0];
      operation.requestedStart = '2026-11-25T04:45:00+01:00'; operation.duration = sourced('30', 'min');
      input.interval.start = '2026-11-25T05:00:00+01:00';
      operation.demands = ['baker', 'oven'].map(id => ({ resourceId: id, unit: id === 'baker' ? 'person' as const : 'piece' as const, amount: sourced('1', id === 'baker' ? 'person' : 'piece'), duration: sourced('30', 'min'), offsetMinutes: '0' }));
      input.operations = [operation];
      input.resources.forEach(resource => { resource.availability = [{ ...input.interval, start: failed.includes(resource.id) ? input.interval.start : operation.requestedStart }]; });
      input.openingWip = [{ id: 'opening', batchId: operation.batchId, operationId: operation.id, startedAt: operation.requestedStart, quantity: { value: '20', unit: 'piece' }, evidence: sourced('20', 'piece'), priorLabor: sourced('15', 'person-min'), priorCost: sourced('15', 'PLN'), coverage: [] }];
      const result = evaluateWeek(input);
      expect([...new Set(result.qualifications.map(row => row.domain))].sort()).toEqual(failed.map(id => id === 'baker' ? 'people' : 'machines').sort());
      expect(result.operations[0].start).toBe('2026-11-25T03:45:00.000Z');
      expect(result.laborExposure.baker).toEqual({ before: 15, inside: 15, after: 0 });
    }
  });
  it('retains Sunday history and splits an active reservation at the boundary', () => {
    const input = upgradeScenario(scenarioFixture());
    input.interval = { start: '2026-11-23T00:00:00+01:00', end: '2026-11-30T00:00:00+01:00', zone: 'Europe/Warsaw' };
    const operation = input.operations[0];
    operation.requestedStart = '2026-11-22T22:00:00+01:00'; operation.duration = sourced('480', 'min'); operation.demands = [];
    input.openingWip = [{ id: 'opening', batchId: operation.batchId, operationId: operation.id, startedAt: operation.requestedStart,
      quantity: { value: '20', unit: 'piece' }, evidence: sourced('20', 'piece'), priorLabor: missing('person-min'), priorCost: missing('PLN'), coverage: [] }];
    const result = evaluateWeek(input);
    expect(result.operations.find(row => row.id === operation.id)).toMatchObject({ start: '2026-11-22T21:00:00.000Z', elapsedMinutes: 480, minutesBefore: 120, minutesInside: 360 });
    operation.duration = sourced('30', 'min'); operation.requestedStart = '2026-11-22T23:45:00+01:00'; input.openingWip[0].startedAt = operation.requestedStart;
    operation.demands = [{ resourceId: 'baker', amount: sourced('1', 'person'), unit: 'person', offsetMinutes: '0', duration: sourced('30', 'min') }];
    input.operations = [operation];
    const active = evaluateWeek(input);
    expect(active.laborExposure.baker).toMatchObject({ before: 15, inside: 15, after: 0 });
    expect(active.laborMinutes.baker).toBe(15);
  });
  it('checks the intersection of applicable windows and retains closing WIP', () => {
    const input = upgradeScenario(scenarioFixture());
    const target = input.operations.find(row => row.id === 'bake-B')!;
    input.windows = input.windows.filter(row => row.operationId !== target.id);
    input.windows.push({ id: 'limit', batchId: target.batchId, operationId: target.id, predecessorId: target.predecessors[0], useFromMinutes: '0', useUntilMinutes: sourced('10', 'min') });
    const queued = evaluateWeek(input);
    expect(queued.windowChecks.find(row => row.windowId === 'limit')).toMatchObject({ status: 'violated', excessMinutes: 5 });
    input.windows.find(row => row.id === 'limit')!.useUntilMinutes = sourced('15', 'min');
    expect(evaluateWeek(input).windowChecks.find(row => row.windowId === 'limit')?.status).toBe('checked');
    input.interval.end = '2026-11-25T06:40:00+01:00';
    expect(evaluateWeek(input).closingWip.map(row => row.operationId)).toContain('bake-B');
  });
});
