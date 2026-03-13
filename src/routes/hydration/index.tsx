import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/PageLayout";
import HydrationCalculator from "@/features/hydration/components/HydrationCalculator";
import { hydrationQueryOptions } from "@/features/hydration/calculateHydration.server";

export const Route = createFileRoute("/hydration/")({
  component: HydrationPage,
  loader: async ({ context: { queryClient } }) => {
    // Prefetch default hydration results
    await queryClient.ensureQueryData(hydrationQueryOptions({ flourWeight: 500, desiredHydration: 70 }));
  },
});

function HydrationPage() {
  return (
    <PageLayout title="Hydration Calculator">
      <HydrationCalculator />
    </PageLayout>
  );
}
