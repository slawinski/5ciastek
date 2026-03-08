import { z } from 'zod';

export const fermentationSchema = z.object({
  temperature: z.number().min(20, "Temperature must be at least 20°C").max(30, "Temperature must be at most 30°C"),
  hydration: z.enum(['75', '80']).transform(Number),
});
