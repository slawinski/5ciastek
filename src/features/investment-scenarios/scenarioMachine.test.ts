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
  actor.send({ type: 'LOGOUT' }); actor.send({ type: 'RESULT' }); expect(actor.getSnapshot().value).toBe('loggingOut');
  actor.send({ type: 'LOGGED_OUT' }); expect(actor.getSnapshot().value).toBe('denied');
});

it('blocks reload and late command events until logout settles', () => {
  const actor = createActor(scenarioMachine).start();
  actor.send({ type: 'LOADED' }); actor.send({ type: 'LOGOUT' });
  for (const type of ['LOAD', 'LOADED', 'EMPTY', 'EDIT', 'SAVE', 'SAVED', 'RUN', 'RESULT', 'FAILED', 'DENIED', 'LOGOUT']) {
    actor.send({ type });
    expect(actor.getSnapshot().value).toBe('loggingOut');
  }
  actor.send({ type: 'LOGOUT_FAILED' }); expect(actor.getSnapshot().value).toBe('error');
  actor.send({ type: 'LOAD' }); actor.send({ type: 'LOADED' }); expect(actor.getSnapshot().value).toBe('saved');
  actor.stop();
});
