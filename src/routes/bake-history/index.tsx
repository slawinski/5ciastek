import { createFileRoute } from '@tanstack/react-router'
import { HistoryDashboard } from '@/features/history';

export const Route = createFileRoute('/bake-history/')({
  component: BakeHistory,
})

function BakeHistory() {
  return <HistoryDashboard />;
}
