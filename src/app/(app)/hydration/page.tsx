import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { PageLayout } from "@/components/PageLayout";
import HydrationCalculator from "@/features/hydration/components/HydrationCalculator";
import { hydrationQueryOptions } from "@/features/hydration/calculateHydration";

export const dynamic = 'force-dynamic';
export default async function HydrationPage() {
  const queryClient = new QueryClient();
  await queryClient.fetchQuery(hydrationQueryOptions({ flourWeight: 500, desiredHydration: 70 }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <PageLayout title="Hydration Calculator">
      <HydrationCalculator />
    </PageLayout>
    </HydrationBoundary>
  );
}
