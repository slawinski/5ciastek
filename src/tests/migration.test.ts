import { expect, it } from 'vitest';
import { createActor } from 'xstate';
import { bakeAlongMachine } from '@/features/bake-a-long/bakeAlongMachine';
import { calculateFermentationTimesServer } from '@/features/fermentation/fermentation.actions';
import { calculateHydrationServer } from '@/features/hydration/hydration.actions';

it('retains characterized calculator defaults and server rejection', async () => {
  const result = await calculateFermentationTimesServer({ data: { temperature: 23, hydration: '75' } });
  expect(result.bulkTime).toBeCloseTo(4.14, 2);
  expect(result.proofTime).toBeCloseTo(3.04, 2);
  expect(result.totalTime).toBeCloseTo(7.18, 2);
  await expect(calculateHydrationServer({ data: { flourWeight: -1, desiredHydration: 70 } })).rejects.toThrow();
});

it('retains guarded wizard forward/back/reset and schedule generation', () => {
  const actor = createActor(bakeAlongMachine).start();
  actor.send({ type: 'NEXT' });
  expect(actor.getSnapshot().value).toBe('scheduling');
  actor.send({ type: 'UPDATE_SCHEDULE', readyTime: new Date('2026-11-25T09:00:00Z') });
  actor.send({ type: 'NEXT' });
  actor.send({ type: 'UPDATE_DOUGH', doughTemp: 23, hydration: 75, autolyseType: 'autolyse' });
  actor.send({ type: 'NEXT' });
  actor.send({ type: 'BACK' });
  expect(actor.getSnapshot().value).toBe('dough');
  actor.send({ type: 'NEXT' });
  actor.send({ type: 'UPDATE_STARTER', levainRatio: '1:2:2', ambientTemp: 23, levainFlourType: 'wheat' });
  actor.send({ type: 'NEXT' });
  expect(actor.getSnapshot().value).toBe('generated');
  expect(actor.getSnapshot().context.schedule?.length).toBeGreaterThan(0);
  actor.send({ type: 'RESET' });
  expect(actor.getSnapshot().context.schedule).toBeNull();
  expect(actor.getSnapshot().value).toBe('scheduling');
  actor.stop();
});
