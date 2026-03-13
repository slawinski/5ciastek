export const calculateHydration = (flourWeight: number, desiredHydration: number) => {
  // Starter is 20% of baker's percentage (of total flour weight)
  const starterWeight = flourWeight * 0.20;
  // Starter is 1:1 water and flour
  const starterFlour = starterWeight / 2;
  const starterWater = starterWeight / 2;

  const totalFlour = flourWeight + starterFlour;
  const desiredTotalWater = totalFlour * (desiredHydration / 100);
  const waterToAdd = desiredTotalWater - starterWater;

  return { 
    waterToAdd,
    starterWeight,
    starterFlour,
    starterWater,
    totalFlour,
    totalWater: desiredTotalWater
  };
};
