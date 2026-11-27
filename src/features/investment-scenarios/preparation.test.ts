import { expect, it } from 'vitest';
import { monthlyFixture } from '@/tests/fixtures/investment-month';
import { sourced } from '@/tests/fixtures/investment-scenarios';
import { savedInputV2Schema } from './schema-v2';

function preparationFixture() {
  const saved = monthlyFixture(); const preparation = saved.input.month!.preparations[0];
  preparation.operations[0].duration = sourced('20', 'min');
  preparation.operations[0].requestedStart = '2026-11-29T23:40:00+01:00';
  preparation.operations[0].demands = [{ resourceId: 'outside-baker', amount: sourced('1', 'person'), unit: 'person', offsetMinutes: '0', duration: sourced('20', 'min') }];
  preparation.resources = [{ ...saved.input.resources[0], id: 'outside-baker', availability: [{ start: preparation.operations[0].requestedStart, end: preparation.readyAt, zone: saved.input.interval.zone }] }];
  return saved;
}

it('accepts integer staffed preparation and rejects fractional demands or role capacities', () => {
  const saved = preparationFixture(); const prep = saved.input.month!.preparations[0];
  expect(savedInputV2Schema.safeParse(saved).success).toBe(true);
  for (const value of ['0.5', '1.5']) {
    prep.operations[0].demands[0].amount = sourced(value, 'person');
    expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
  }
  prep.operations[0].demands[0].amount = sourced('1', 'person');
  prep.resources[0].capacity = sourced('1.5', 'person');
  expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
});

it('rejects demand containment, unknown resources and overlapping preparation availability', () => {
  const saved = preparationFixture(); const prep = saved.input.month!.preparations[0];
  prep.operations[0].duration = sourced('1', 'min');
  expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
  prep.operations[0].duration = sourced('20', 'min');
  prep.operations[0].demands[0].resourceId = 'unknown';
  expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
  prep.operations[0].demands[0].resourceId = 'outside-baker';
  prep.resources[0].availability.push({ ...prep.resources[0].availability[0] });
  expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
});

it('rejects changed measured contexts, wrong time units and cyclic preparation dependencies', () => {
  const saved = preparationFixture(); const op = saved.input.month!.preparations[0].operations[0];
  const duration = sourced('20', 'min');
  if (duration.status === 'missing') throw new Error('Expected sourced duration');
  op.duration = { ...duration, status: 'measured' };
  op.observationContext = { ...op.context, conditions: 'Inne warunki' };
  expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
  op.duration = sourced('20', 'min'); delete op.observationContext;
  op.demands[0].duration = sourced('20', 'hour');
  expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
  op.demands[0].duration = sourced('20', 'min'); op.predecessors = [op.id];
  expect(savedInputV2Schema.safeParse(saved).success).toBe(false);
});
