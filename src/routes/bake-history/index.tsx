import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bake-history/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/bake-history"!</div>
}
