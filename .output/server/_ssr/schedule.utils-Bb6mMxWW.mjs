const expDecay = (x, a, b, c) => {
  return a * Math.exp(-b * x) + c;
};
const params = {
  bulk_fermentation_time: { a: 169.5076, b: 0.1872, c: 1.8512 },
  proofing_time: { a: 124.6544, b: 0.1873, c: 1.364 },
  total_fermentation_time: { a: 294.3115, b: 0.1873, c: 3.2132 }
};
const DURATIONS = {
  cooling: 2,
  baking: 0.75,
  // 45 minutes
  preheat: 0.5,
  // 30 minutes
  shaping: 0.5,
  // 30 minutes
  autolyse: 0.75,
  // 45 minutes
  mixAndRest: 0.25
  // 15 minute nominal duration for mixing steps
};
const getLevainPeakTime = (ratio, temp, flourType) => {
  const baseHours = {
    "1:1:1": 4,
    "1:2:2": 6
  }[ratio] || 6;
  const tempAdjustment = (21 - temp) * 0.5;
  const flourMultiplier = {
    "Rye": 0.8,
    "Whole Wheat": 0.9,
    "Bread Flour": 1
  }[flourType] || 1;
  return (baseHours + tempAdjustment) * flourMultiplier;
};
const generateSchedule = (context) => {
  if (!context.readyTime || !context.doughTemp || !context.hydration || !context.levainRatio || !context.ambientTemp || !context.autolyseType || !context.levainFlourType) {
    return [];
  }
  const { readyTime, doughTemp, hydration, levainRatio, ambientTemp, autolyseType, levainFlourType } = context;
  const phases = [];
  const hoursToMs = (hours) => hours * 60 * 60 * 1e3;
  const bakeEndTime = new Date(readyTime.getTime() - hoursToMs(DURATIONS.cooling));
  phases.push({ label: "Cooling", start: bakeEndTime, end: readyTime });
  const bakeStartTime = new Date(bakeEndTime.getTime() - hoursToMs(DURATIONS.baking));
  phases.push({ label: "Baking", start: bakeStartTime, end: bakeEndTime });
  const preheatTime = new Date(bakeStartTime.getTime() - hoursToMs(DURATIONS.preheat));
  phases.push({ label: "Pre-heat Oven", start: preheatTime, end: bakeStartTime });
  const adjustmentFactor = 75 / hydration;
  const proofingHours = expDecay(doughTemp, params.proofing_time.a, params.proofing_time.b, params.proofing_time.c) * adjustmentFactor;
  const proofingEndTime = bakeStartTime;
  const proofingStartTime = new Date(proofingEndTime.getTime() - hoursToMs(proofingHours));
  phases.push({ label: "Final Proof", start: proofingStartTime, end: proofingEndTime });
  const shapingEndTime = proofingStartTime;
  const shapingStartTime = new Date(shapingEndTime.getTime() - hoursToMs(DURATIONS.shaping));
  phases.push({ label: "Shape Dough", start: shapingStartTime, end: shapingEndTime });
  const bulkHours = expDecay(doughTemp, params.bulk_fermentation_time.a, params.bulk_fermentation_time.b, params.bulk_fermentation_time.c) * adjustmentFactor;
  const bulkEndTime = shapingStartTime;
  const bulkStartTime = new Date(bulkEndTime.getTime() - hoursToMs(bulkHours));
  phases.push({ label: "Bulk Fermentation", start: bulkStartTime, end: bulkEndTime });
  if (autolyseType === "autolyse") {
    const addLevainEndTime = bulkStartTime;
    const addLevainStartTime = new Date(addLevainEndTime.getTime() - hoursToMs(DURATIONS.mixAndRest));
    phases.push({ label: "Add Levain & Salt", start: addLevainStartTime, end: addLevainEndTime });
    const autolyseEndTime = addLevainStartTime;
    const autolyseStartTime = new Date(autolyseEndTime.getTime() - hoursToMs(DURATIONS.autolyse));
    phases.push({ label: "Autolyse", start: autolyseStartTime, end: autolyseEndTime });
    const levainReadyTime = addLevainStartTime;
    const levainPeakHours = getLevainPeakTime(levainRatio, ambientTemp, levainFlourType);
    const levainFeedTime = new Date(levainReadyTime.getTime() - hoursToMs(levainPeakHours));
    phases.push({ label: "Feed Starter", start: levainFeedTime, end: new Date(levainFeedTime.getTime() + hoursToMs(DURATIONS.mixAndRest)) });
  } else {
    const mixEndTime = bulkStartTime;
    const mixStartTime = new Date(mixEndTime.getTime() - hoursToMs(DURATIONS.mixAndRest));
    phases.push({ label: "Mix All Ingredients", start: mixStartTime, end: mixEndTime });
    const levainReadyTime = mixStartTime;
    const levainPeakHours = getLevainPeakTime(levainRatio, ambientTemp, levainFlourType);
    const levainFeedTime = new Date(levainReadyTime.getTime() - hoursToMs(levainPeakHours));
    phases.push({ label: "Feed Starter", start: levainFeedTime, end: new Date(levainFeedTime.getTime() + hoursToMs(DURATIONS.mixAndRest)) });
  }
  return phases.sort((a, b) => a.start.getTime() - b.start.getTime());
};
export {
  expDecay as e,
  generateSchedule as g,
  params as p
};
