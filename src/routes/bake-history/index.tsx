import { createFileRoute } from '@tanstack/react-router'
import UnderConstruction from '@/components/UnderConstruction';

export const Route = createFileRoute('/bake-history/')({
  component: BakeHistory,
})

function BakeHistory() {
  return <UnderConstruction />;
}