import { o as object, _ as _enum, n as number } from "../_libs/zod.mjs";
const fermentationSchema = object({
  temperature: number().min(20, "Temperature must be at least 20°C").max(30, "Temperature must be at most 30°C"),
  hydration: _enum(["75", "80"]).transform(Number)
});
export {
  fermentationSchema as f
};
