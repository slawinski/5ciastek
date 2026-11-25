import { queryOptions } from '@tanstack/react-query';
import { getBakingTipsServer } from './tips.actions';
export const bakingTipsQueryOptions = queryOptions({ queryKey: ['bakingTips'], queryFn: getBakingTipsServer, staleTime: Infinity });
