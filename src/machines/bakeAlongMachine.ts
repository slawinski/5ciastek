import { createMachine, assign } from "xstate";
import { generateSchedule, SchedulePhase } from "@/utils/schedule.utils";

// Define the type for the machine's context
export interface BakeAlongContext {
  readyTime: Date | null;
  doughTemp: number | null;
  hydration: number | null;
  autolyseType: 'autolyse' | 'fermentolyse' | null;
  levainFlourType: string | null;
  levainRatio: string | null;
  ambientTemp: number | null;
  schedule: SchedulePhase[] | null;
}

// Define the type for the machine's events
export type BakeAlongEvent =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "UPDATE_SCHEDULE"; readyTime: Date }
  | { type: "UPDATE_DOUGH"; doughTemp: number | null; hydration: number; autolyseType: 'autolyse' | 'fermentolyse' | null }
  | { type: "UPDATE_STARTER"; levainRatio: string; ambientTemp: number | null; levainFlourType: string };

export const bakeAlongMachine = createMachine({
  id: "bakeAlong",
  initial: "scheduling",
  context: {
    readyTime: null,
    doughTemp: null,
    hydration: null,
    levainRatio: null,
    ambientTemp: null,
    autolyseType: null,
    levainFlourType: null,
    schedule: null,
  },
  states: {
    scheduling: {
      on: {
        UPDATE_SCHEDULE: {
          actions: assign({
            readyTime: ({ event }) => event.readyTime,
          }),
        },
        NEXT: {
          target: "dough",
          guard: ({ context }) => context.readyTime !== null,
        },
      },
    },
    dough: {
      on: {
        UPDATE_DOUGH: {
          actions: assign({
            doughTemp: ({ event }) => event.doughTemp,
            hydration: ({ event }) => event.hydration,
            autolyseType: ({ event }) => event.autolyseType,
          }),
        },
        NEXT: {
          target: "starter",
          guard: ({ context }) =>
            context.doughTemp !== null && context.hydration !== null && context.autolyseType !== null,
        },
        BACK: "scheduling",
      },
    },
    starter: {
      on: {
        UPDATE_STARTER: {
          actions: assign({
            levainRatio: ({ event }) => event.levainRatio,
            ambientTemp: ({ event }) => event.ambientTemp,
            levainFlourType: ({ event }) => event.levainFlourType,
          }),
        },
        NEXT: {
          target: "generated",
          guard: ({ context }) =>
            context.levainRatio !== null &&
            context.ambientTemp !== null &&
            context.levainFlourType !== null,
        },
        BACK: "dough",
      },
    },
    generated: {
      entry: assign({
        schedule: ({ context }) => generateSchedule(context),
      }),
      on: {
        RESET: {
          target: "scheduling",
          actions: assign({
            readyTime: null,
            doughTemp: null,
            hydration: null,
            levainRatio: null,
            ambientTemp: null,
            autolyseType: null,
            levainFlourType: null,
            schedule: null,
          })
        },
        BACK: "starter",
      },
    },
  },
});
