import { createMachine, assign } from 'xstate';

export const bakeAlongMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mIKIDGBLA9gOygJxgFzAWwCtYBxAEzADoBBAKjoA2YgGICiAVAFQGUBBAB1VYgAPRAGIAZABUAsgEoBdAQQAdxSChhioAA5FY+GagDQgAnokBmAGx16t6zRoDsTgDYAbAE5eQn5eXgC+cZoxWHiElDwiUhgYBAISfAwiAEYAXIiwAA0kAGtJABk3SADJYAAjABV5CgBfNAyvCAoAfQy-E2p8oLiElDyCUnzC0tIq6po6hnZODl4B0bEx1XUNTRw8CgBGUXzC0rKqGgAnBDSiAJIILyCq0r0S5S6fADcdAAyX-b0gA */
  id: 'bakeAlong',
  initial: 'scheduling',
  context: {
    readyTime: null,
    doughTemp: null,
    hydration: null,
    levainRatio: null,
    ambientTemp: null,
  },
  states: {
    scheduling: {
      on: {
        NEXT: 'dough',
      },
    },
    dough: {
      on: {
        NEXT: 'starter',
        BACK: 'scheduling',
      },
    },
    starter: {
      on: {
        NEXT: 'review',
        BACK: 'dough',
      },
    },
    review: {
      on: {
        GENERATE: 'generated',
        BACK: 'starter',
      },
    },
    generated: {
      on: {
        RESET: 'scheduling',
      },
    },
  },
});