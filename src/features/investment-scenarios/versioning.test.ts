import { describe, expect, it } from 'vitest';
import { scenarioFixture } from '@/tests/fixtures/investment-scenarios';
import { scenarioSchema } from './schema';
import { scenarioV2Schema } from './schema-v2';
import { upgradeScenario } from './upgrade';

describe('versioned investment inputs', () => {
  it('keeps the original v1 intact and marks new financial inputs missing', () => {
    const original = scenarioFixture(); const before = JSON.stringify(original);
    const upgraded = upgradeScenario(original);
    expect(scenarioSchema.parse(original)).toEqual(original);
    expect(JSON.stringify(original)).toBe(before);
    expect(upgraded.schemaVersion).toBe(2);
    expect(upgraded.batches.map(batch => batch.target)).toEqual([20, 12]);
    expect(upgraded.month).toBeNull();
    expect(upgraded.investment.deposit.status).toBe('missing');
    expect(scenarioV2Schema.parse(JSON.parse(JSON.stringify(upgraded)))).toEqual(upgraded);
  });
  it('rejects duplicate batches and a finished lot bound to another batch', () => {
    const input = upgradeScenario(scenarioFixture());
    input.batches.push(structuredClone(input.batches[0]));
    expect(scenarioV2Schema.safeParse(input).success).toBe(false);
    input.batches.pop();
    input.lots[0].batchId = input.batches[1].id;
    expect(scenarioV2Schema.safeParse(input).success).toBe(false);
  });
});
