import { it, expect } from 'vitest';
import { createActor } from 'xstate';
import { scenarioMachine } from './scenarioMachine';

it('requires confirmed save before running and retains changed state on a failed save', () => {
  const actor = createActor(scenarioMachine).start();
  actor.send({ type: 'EMPTY' }); actor.send({ type: 'EDIT' }); actor.send({ type: 'RUN' });
  expect(actor.getSnapshot().value).toBe('draft');
  actor.send({ type: 'SAVE' }); actor.send({ type: 'FAILED' }); expect(actor.getSnapshot().value).toBe('changed');
  actor.send({ type: 'SAVE' }); actor.send({ type: 'SAVED' }); actor.send({ type: 'RUN' }); actor.send({ type: 'RESULT' });
  expect(actor.getSnapshot().value).toBe('result');
  actor.send({ type: 'EDIT' }); expect(actor.getSnapshot().value).toBe('changed');
  actor.send({ type: 'LOGOUT' }); actor.send({ type: 'RESULT' }); expect(actor.getSnapshot().value).toBe('denied');
});
