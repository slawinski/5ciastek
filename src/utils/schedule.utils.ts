import { BakeAlongContext } from "@/machines/bakeAlongMachine";

export interface SchedulePhase {
  label: string;
  start: Date;
  end: Date;
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
  autolyse: 0.75, // 45 minutes
  mixAndRest: 0.25, // 15 minute nominal duration for mixing steps
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

export const generateSchedule = (context: BakeAlongContext): SchedulePhase[] => {
  if (!context.readyTime || !context.doughTemp || !context.hydration || !context.levainRatio || !context.ambientTemp || !context.autolyseType || !context.levainFlourType) {
    return []; // Not enough data to generate a schedule
  }

  const { readyTime, doughTemp, hydration, levainRatio, ambientTemp, autolyseType, levainFlourType } = context;
  const phases: SchedulePhase[] = [];

  const hoursToMs = (hours: number) => hours * 60 * 60 * 1000;

  // 1. Cooling
  const bakeEndTime = new Date(readyTime.getTime() - hoursToMs(DURATIONS.cooling));
  phases.push({ label: 'Cooling', start: bakeEndTime, end: readyTime });

  // 2. Baking
  const bakeStartTime = new Date(bakeEndTime.getTime() - hoursToMs(DURATIONS.baking));
  phases.push({ label: 'Baking', start: bakeStartTime, end: bakeEndTime });

  // 3. Pre-heating
  const preheatTime = new Date(bakeStartTime.getTime() - hoursToMs(DURATIONS.preheat));
  phases.push({ label: 'Pre-heat Oven', start: preheatTime, end: bakeStartTime });

  // 4. Proofing (Dynamic)
  const adjustmentFactor = 75 / hydration;
  const proofingHours = expDecay(doughTemp, params.proofing_time.a, params.proofing_time.b, params.proofing_time.c) * adjustmentFactor;
  const proofingEndTime = bakeStartTime;
  const proofingStartTime = new Date(proofingEndTime.getTime() - hoursToMs(proofingHours));
  phases.push({ label: 'Final Proof', start: proofingStartTime, end: proofingEndTime });
  
  // 5. Shaping
  const shapingEndTime = proofingStartTime;
  const shapingStartTime = new Date(shapingEndTime.getTime() - hoursToMs(DURATIONS.shaping));
  phases.push({ label: 'Shape Dough', start: shapingStartTime, end: shapingEndTime });
  
  // 6. Bulk Fermentation (Dynamic)
  const bulkHours = expDecay(doughTemp, params.bulk_fermentation_time.a, params.bulk_fermentation_time.b, params.bulk_fermentation_time.c) * adjustmentFactor;
  const bulkEndTime = shapingStartTime;
  const bulkStartTime = new Date(bulkEndTime.getTime() - hoursToMs(bulkHours));
  phases.push({ label: 'Bulk Fermentation', start: bulkStartTime, end: bulkEndTime });

  // 7. Mixing & Autolyse/Fermentolyse Logic
  if (autolyseType === 'autolyse') {
    const addLevainEndTime = bulkStartTime;
    const addLevainStartTime = new Date(addLevainEndTime.getTime() - hoursToMs(DURATIONS.mixAndRest));
    phases.push({ label: 'Add Levain & Salt', start: addLevainStartTime, end: addLevainEndTime });
    
    const autolyseEndTime = addLevainStartTime;
    const autolyseStartTime = new Date(autolyseEndTime.getTime() - hoursToMs(DURATIONS.autolyse));
    phases.push({ label: 'Autolyse', start: autolyseStartTime, end: autolyseEndTime });

    const levainReadyTime = addLevainStartTime;
    const levainPeakHours = getLevainPeakTime(levainRatio, ambientTemp, levainFlourType);
    const levainFeedTime = new Date(levainReadyTime.getTime() - hoursToMs(levainPeakHours));
    phases.push({ label: 'Feed Starter', start: levainFeedTime, end: new Date(levainFeedTime.getTime() + hoursToMs(DURATIONS.mixAndRest))});

  } else { // Fermentolyse
    const mixEndTime = bulkStartTime;
    const mixStartTime = new Date(mixEndTime.getTime() - hoursToMs(DURATIONS.mixAndRest));
    phases.push({ label: 'Mix All Ingredients', start: mixStartTime, end: mixEndTime });

    const levainReadyTime = mixStartTime;
    const levainPeakHours = getLevainPeakTime(levainRatio, ambientTemp, levainFlourType);
    const levainFeedTime = new Date(levainReadyTime.getTime() - hoursToMs(levainPeakHours));
    phases.push({ label: 'Feed Starter', start: levainFeedTime, end: new Date(levainFeedTime.getTime() + hoursToMs(DURATIONS.mixAndRest))});
  }

  // Gantt charts are typically ordered top-to-bottom chronologically
  return phases.sort((a, b) => a.start.getTime() - b.start.getTime());
};
