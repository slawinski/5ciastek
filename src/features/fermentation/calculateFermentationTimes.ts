import { queryOptions } from '@tanstack/react-query';
import { calculateFermentationTimesServer } from './fermentation.actions';
export const fermentationQueryOptions = (data: { temperature: number; hydration: string }) => queryOptions({
  queryKey: ['fermentation', data], queryFn: () => calculateFermentationTimesServer({ data }), staleTime: 3600000,
});
