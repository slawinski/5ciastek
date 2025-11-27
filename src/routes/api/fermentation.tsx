import { createServerFn } from "@tanstack/react-start";
import { fermentationSchema } from "@/schemas/fermentation";
import { expDecay, params } from "@/utils/schedule.utils";

export const calculateFermentationTimesServer = createServerFn()
  .inputValidator((data) => fermentationSchema.parse(data))
  .handler(async ({ data }) => {
    const { temperature, hydration } = data;

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
  });
