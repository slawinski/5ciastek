import { describe, expect, it } from 'vitest';
import { evidenceSchema, intervalSchema, quantitySchema } from './values';
import { fingerprint } from './identity';
import { scenarioSchema } from './schema';
import { scenarioFixture } from '@/tests/fixtures/investment-scenarios';

describe('sourced scenario values', () => {
  it('retains missing values and explicit zero through JSON', () => {
    const values = [{ status: 'missing', reason: 'Brak najmu', unit: 'PLN' }, {
      status: 'estimated', value: '0', unit: '%', source: 'Założenie', date: '2026-11-25', version: '1', period: 'day', context: 'Bez strat',
    }];
    expect(JSON.parse(JSON.stringify(values.map(value => evidenceSchema.parse(value))))).toEqual(values);
  });
  it('normalizes mass without accepting excessive precision or converting pieces', () => {
    expect(quantitySchema.parse({ value: '1', unit: 'kg' })).toEqual({ value: '1000', unit: 'g' });
    expect(quantitySchema.parse({ value: '0', unit: 'g' }).value).toBe('0');
    expect(quantitySchema.safeParse({ value: '1.0001', unit: 'g' }).success).toBe(false);
    expect(quantitySchema.safeParse({ value: '-1', unit: 'piece' }).success).toBe(false);
  });
  it('requires offset and matching zone, preserving midnight crossings', () => {
    const interval = { start: '2026-11-24T23:00:00+01:00', end: '2026-11-25T06:00:00+01:00', zone: 'Europe/Warsaw' };
    expect(intervalSchema.parse(interval)).toEqual(interval);
    expect(intervalSchema.safeParse({ ...interval, start: '2026-11-24T23:00:00' }).success).toBe(false);
    expect(intervalSchema.safeParse({ ...interval, start: '2026-11-24T23:00:00+02:00' }).success).toBe(false);
  });
  it('fingerprints canonical object keys and changes with provenance and order', () => {
    expect(fingerprint({ a: '1', b: ['x', 'y'] })).toBe(fingerprint({ b: ['x', 'y'], a: '1' }));
    expect(fingerprint({ a: ['x', 'y'] })).not.toBe(fingerprint({ a: ['y', 'x'] }));
    expect(fingerprint({ source: 'A' })).not.toBe(fingerprint({ source: 'B' }));
  });
  it('rejects cycles, contradictory staffing, context reuse and movement identities', () => {
    const input = scenarioFixture();
    expect(scenarioSchema.parse(input)).toEqual(input);
    input.operations[0].predecessors = ['bake-A'];
    expect(scenarioSchema.safeParse(input).success).toBe(false);
    input.operations[0].predecessors = [];
    input.operations[0].demands[0].amount = { status: 'missing', reason: 'Brak', unit: 'person' };
    const badStaff = structuredClone(input);
    badStaff.operations[0].context.staff = 1.5;
    expect(scenarioSchema.safeParse(badStaff).success).toBe(false);
    input.operations[0].duration = { status: 'measured', value: '15', unit: 'min', source: 'Pomiar', date: '2026-11-25', version: '1', period: 'day', context: 'Pomiar X' };
    input.operations[0].observationContext = { ...input.operations[0].context, machine: 'X', staff: 2 };
    expect(scenarioSchema.safeParse(input).success).toBe(false);
    input.operations[0].duration = { ...input.operations[0].duration, status: 'estimated', observationRef: 'pomiar-X' };
    expect(scenarioSchema.safeParse(input).success).toBe(true);
    input.movements.push({ ...input.movements[0], quantity: { value: '1', unit: 'piece' } });
    expect(scenarioSchema.safeParse(input).success).toBe(false);
  });
});
