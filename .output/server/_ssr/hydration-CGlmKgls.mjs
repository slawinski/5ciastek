import { o as object, n as number } from "../_libs/zod.mjs";
const hydrationSchema = object({
  flourWeight: number().min(1, "Flour weight must be at least 1g").max(1e4, "Maximum flour weight is 10kg"),
  desiredHydration: number().min(0, "Hydration must be at least 0%").max(100, "Hydration must be at most 100%")
});
export {
  hydrationSchema as h
};
