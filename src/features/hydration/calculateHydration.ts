import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { hydrationSchema } from "./hydration";
import { calculateHydration } from "./hydration.utils";

export const calculateHydrationServer = createServerFn()
  .inputValidator((data) => hydrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { flourWeight, desiredHydration } = data;
    return calculateHydration(flourWeight, desiredHydration);
  });

export const hydrationQueryOptions = (data: { flourWeight: number; desiredHydration: number }) => 
  queryOptions({
    queryKey: ["hydration", data],
    queryFn: () => calculateHydrationServer({ data }),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
