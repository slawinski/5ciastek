import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import FermentationCalculator from '@/features/fermentation/FermentationCalculator';
import { fermentationQueryOptions } from '@/features/fermentation/calculateFermentationTimes';
import { bakingTipsQueryOptions } from '@/features/fermentation/getBakingTips';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const client = new QueryClient();
  await Promise.all([client.fetchQuery(bakingTipsQueryOptions), client.fetchQuery(fermentationQueryOptions({ temperature: 23, hydration: '75' }))]);
  return <HydrationBoundary state={dehydrate(client)}><FermentationCalculator /></HydrationBoundary>;
}
