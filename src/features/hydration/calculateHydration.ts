import { queryOptions } from '@tanstack/react-query';
import { calculateHydrationServer } from './hydration.actions';
export const hydrationQueryOptions = (data: { flourWeight: number; desiredHydration: number }) => queryOptions({
  queryKey: ['hydration', data], queryFn: () => calculateHydrationServer({ data }), staleTime: 3600000,
});
