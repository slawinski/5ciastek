export const expDecay = (x: number, a: number, b: number, c: number) => {
  return a * Math.exp(-b * x) + c;
};

export const params = {
  bulk_fermentation_time: { a: 169.5076, b: 0.1872, c: 1.8512 },
  proofing_time: { a: 124.6544, b: 0.1873, c: 1.364 },
  total_fermentation_time: { a: 294.3115, b: 0.1873, c: 3.2132 },
};

export function formatTime(time: number) {
  const hours = Math.floor(time);
  const minutes = Math.trunc((time * 60) % 60);
  return `${hours}h ${minutes}m`;
}

export const calculateFermentationTimes = (temperature: number, hydration: number) => {
  const adjustmentFactor = 75 / hydration;

  const bulkTime =
    expDecay(
      temperature,
      params.bulk_fermentation_time.a,
      params.bulk_fermentation_time.b,
      params.bulk_fermentation_time.c
    ) * adjustmentFactor;
  const proofTime =
    expDecay(
      temperature,
      params.proofing_time.a,
      params.proofing_time.b,
      params.proofing_time.c
    ) * adjustmentFactor;
  const totalTime =
    expDecay(
      temperature,
      params.total_fermentation_time.a,
      params.total_fermentation_time.b,
      params.total_fermentation_time.c
    ) * adjustmentFactor;

  return { bulkTime, proofTime, totalTime };
};
