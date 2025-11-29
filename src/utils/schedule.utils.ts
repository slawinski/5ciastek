import { BakeAlongContext } from "@/machines/bakeAlongMachine";

export interface ScheduleEvent {
  time: Date;
  title: string;
  description: string;
}


// --- Moved from api/fermentation.tsx ---

export const expDecay = (x: number, a: number, b: number, c: number) => {
  return a * Math.exp(-b * x) + c;
};

export const params = {
  bulk_fermentation_time: { a: 169.5076, b: 0.1872, c: 1.8512 },
  proofing_time: { a: 124.6544, b: 0.1873, c: 1.364 },
  total_fermentation_time: { a: 294.3115, b: 0.1873, c: 3.2132 },
};

// --- New Calculation Logic ---

// Estimated durations in hours for fixed phases
const DURATIONS = {
  cooling: 2,
  baking: 0.75, // 45 minutes
  preheat: 0.5, // 30 minutes
  shaping: 0.5, // 30 minutes
  mixing: 0.75, // 45 minutes for autolyse, mixing, etc.
};

// Simple model for levain peak time based on ratio and temperature
const getLevainPeakTime = (ratio: string, temp: number, flourType: string): number => {
  const baseHours = {
    "1:1:1": 4,
    "1:2:2": 6,
  }[ratio] || 6;

  // Simple temperature adjustment: +/- 30 mins for every degree away from 21°C
  const tempAdjustment = (21 - temp) * 0.5;

  const flourMultiplier = {
    "Rye": 0.8,
    "Whole Wheat": 0.9,
    "Bread Flour": 1.0,
  }[flourType] || 1.0;

  return (baseHours + tempAdjustment) * flourMultiplier;
};

export const generateSchedule = (context: BakeAlongContext) => {
  if (!context.readyTime || !context.doughTemp || !context.hydration || !context.levainRatio || !context.ambientTemp || !context.autolyseType || !context.levainFlourType) {
    return []; // Not enough data to generate a schedule
  }

  const { readyTime, doughTemp, hydration, levainRatio, ambientTemp, autolyseType, levainFlourType } = context;
  const schedule: { time: Date, title: string, description: string }[] = [];

  const msToHours = (ms: number) => ms / 1000 / 60 / 60;
  const hoursToMs = (hours: number) => hours * 60 * 60 * 1000;

  // 1. Start from the end: Ready Time
  schedule.push({ time: readyTime, title: "Ready to Eat!", description: "Enjoy your freshly baked bread." });

  // 2. Cooling
  const bakeEndTime = new Date(readyTime.getTime() - hoursToMs(DURATIONS.cooling));
  schedule.push({ time: bakeEndTime, title: "Bake Finished", description: `Let the bread cool on a wire rack for at least ${DURATIONS.cooling} hours.` });

  // 3. Baking
  const bakeStartTime = new Date(bakeEndTime.getTime() - hoursToMs(DURATIONS.baking));
  schedule.push({ time: bakeStartTime, title: "Start Bake", description: `Bake for ${DURATIONS.baking * 60} minutes.` });

  // 4. Pre-heating
  const preheatTime = new Date(bakeStartTime.getTime() - hoursToMs(DURATIONS.preheat));
  schedule.push({ time: preheatTime, title: "Pre-heat Oven", description: `Pre-heat your oven to the required temperature.` });
  
  // 5. Proofing (Dynamic)
  const adjustmentFactor = 75 / hydration;
  const proofingHours = expDecay(doughTemp, params.proofing_time.a, params.proofing_time.b, params.proofing_time.c) * adjustmentFactor;
  const proofingEndTime = bakeStartTime; // Proofing ends when baking begins
  const proofingStartTime = new Date(proofingEndTime.getTime() - hoursToMs(proofingHours));
  schedule.push({ time: proofingStartTime, title: "Start Final Proof", description: `Proof for approximately ${proofingHours.toFixed(1)} hours.` });

  // 6. Shaping
  const shapingTime = new Date(proofingStartTime.getTime() - hoursToMs(DURATIONS.shaping));
  schedule.push({ time: shapingTime, title: "Shape Dough", description: "Pre-shape, rest, and final shape your dough." });

  // 7. Bulk Fermentation (Dynamic)
  const bulkHours = expDecay(doughTemp, params.bulk_fermentation_time.a, params.bulk_fermentation_time.b, params.bulk_fermentation_time.c) * adjustmentFactor;
  const bulkEndTime = shapingTime; // Bulk ends when shaping begins
  const bulkStartTime = new Date(bulkEndTime.getTime() - hoursToMs(bulkHours));
  schedule.push({ time: bulkStartTime, title: "Start Bulk Fermentation", description: `Bulk ferment for approximately ${bulkHours.toFixed(1)} hours, including folds.` });

  // 8. Mixing & Autolyse/Fermentolyse Logic
  if (autolyseType === 'autolyse') {
    // Autolyse is a separate step BEFORE adding levain
    const addLevainTime = bulkStartTime; // Start of bulk is when levain is added
    schedule.push({ time: addLevainTime, title: "Add Levain & Salt", description: "Mix levain and salt into the autolysed dough." });

    const autolyseDuration = DURATIONS.mixing; // Use the "mixing" duration for autolyse
    const autolyseStartTime = new Date(addLevainTime.getTime() - hoursToMs(autolyseDuration));
    schedule.push({ time: autolyseStartTime, title: "Start Autolyse", description: `Mix flour and water, then let it rest for ${autolyseDuration * 60} minutes.` });

    // Levain must be ready when it's time to add it
    const levainReadyTime = addLevainTime;
    const levainPeakHours = getLevainPeakTime(levainRatio, ambientTemp, levainFlourType);
    const levainFeedTime = new Date(levainReadyTime.getTime() - hoursToMs(levainPeakHours));
    schedule.push({ time: levainFeedTime, title: "Feed Starter (Build Levain)", description: `Feed your starter at a ${levainRatio} ratio. It should be ready in about ${levainPeakHours.toFixed(1)} hours.` });

  } else { // Fermentolyse
    // Fermentolyse means starter is included in the initial mix
    const mixTime = bulkStartTime; // The "mix" is the start of the bulk fermentation
    schedule.push({ time: mixTime, title: "Mix All Ingredients (Fermentolyse)", description: "Combine flour, water, salt, and levain all at once." });
    
    // Levain must be ready for the main mix
    const levainReadyTime = mixTime;
    const levainPeakHours = getLevainPeakTime(levainRatio, ambientTemp, levainFlourType);
    const levainFeedTime = new Date(levainReadyTime.getTime() - hoursToMs(levainPeakHours));
    schedule.push({ time: levainFeedTime, title: "Feed Starter (Build Levain)", description: `Feed your starter at a ${levainRatio} ratio. It should be ready in about ${levainPeakHours.toFixed(1)} hours.` });
  }

  // Sort the schedule chronologically
  return schedule.sort((a, b) => a.time.getTime() - b.time.getTime());
};
