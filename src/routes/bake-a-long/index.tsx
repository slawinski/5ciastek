import { createFileRoute } from '@tanstack/react-router'
import UnderConstruction from '@/components/UnderConstruction';

export const Route = createFileRoute('/bake-a-long/')({
  component: BakeAlong,
})

function BakeAlong() {
  return <UnderConstruction />;
}