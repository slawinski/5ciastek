import { createMachine } from 'xstate';

export const scenarioMachine = createMachine({
  id: 'scenario', initial: 'loading',
  on: { LOAD: '.loading', DENIED: '.denied', LOGOUT: '.loggingOut' },
  states: {
    loading: { on: { EMPTY: 'empty', LOADED: 'saved', FAILED: 'error' } },
    empty: { on: { EDIT: 'draft' } },
    draft: { on: { SAVE: 'saving', EDIT: 'draft' } },
    saving: { on: { SAVED: 'saved', FAILED: 'changed' } },
    saved: { on: { EDIT: 'changed', RUN: 'running' } },
    running: { on: { RESULT: 'result', FAILED: 'saved' } },
    result: { on: { EDIT: 'changed', RUN: 'running' } },
    changed: { on: { SAVE: 'saving', EDIT: 'changed' } },
    loggingOut: { on: { LOAD: {}, DENIED: {}, LOGOUT: {}, LOGGED_OUT: 'denied', LOGOUT_FAILED: 'error' } },
    error: { on: { LOAD: 'loading' } }, denied: { on: { LOAD: 'loading' } },
  },
});
