import { z } from 'zod';

export const hydrationSchema = z.object({
  flourWeight: z.number().min(1, "Flour weight must be at least 1g").max(10000, "Maximum flour weight is 10kg"),
  desiredHydration: z.number().min(0, "Hydration must be at least 0%").max(100, "Hydration must be at most 100%"),
});
