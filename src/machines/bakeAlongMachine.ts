import { createMachine, assign } from "xstate";
import { generateSchedule, ScheduleEvent } from "@/utils/schedule.utils";

// Define the type for the machine's context
export interface BakeAlongContext {
  readyTime: Date | null;
  doughTemp: number | null;
  hydration: number | null;
  autolyseType: 'autolyse' | 'fermentolyse' | null;
  levainFlourType: string | null; // Add levainFlourType
  levainRatio: string | null; // e.g., "1:2:2"
  ambientTemp: number | null;
  schedule: ScheduleEvent[] | null;
}

// Define the type for the machine's events
export type BakeAlongEvent =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GENERATE" }
  | { type: "RESET" }
  | { type: "UPDATE_SCHEDULE"; readyTime: Date }
  | { type: "UPDATE_DOUGH"; doughTemp: number | null; hydration: number; autolyseType: 'autolyse' | 'fermentolyse' | null }
  | { type: "UPDATE_STARTER"; levainRatio: string; ambientTemp: number | null; levainFlourType: string }; // Update UPDATE_STARTER

export const bakeAlongMachine = createMachine({
  id: "bakeAlong",
  initial: "scheduling",
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
        UPDATE_SCHEDULE: {
          actions: assign({
            readyTime: ({ event }) => event.readyTime,
          }),
        },
        NEXT: {
          target: "dough",
          // Add guards for validation here in later tasks
          guard: ({ context }) => context.readyTime !== null, // Example guard
        },
      },
    },
    dough: {
      on: {
        UPDATE_DOUGH: {
          actions: assign({
            doughTemp: ({ event }) => event.doughTemp,
            hydration: ({ event }) => event.hydration,
            autolyseType: ({ event }) => event.autolyseType, // Assign autolyseType
          }),
        },
        NEXT: {
          target: "starter",
          guard: ({ context }) =>
            context.doughTemp !== null && context.hydration !== null && context.autolyseType !== null, // Update guard
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
            levainFlourType: ({ event }) => event.levainFlourType, // Assign levainFlourType
          }),
        },
        NEXT: {
          target: "review",
          guard: ({ context }) =>
            context.levainRatio !== null &&
            context.ambientTemp !== null &&
            context.levainFlourType !== null, // Update guard
        },
        BACK: "dough",
      },
    },
    review: {
      on: {
        GENERATE: "generated",
        BACK: "starter",
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
            schedule: null, // Clear schedule on reset
          })
        },
      },
    },
  },
});
