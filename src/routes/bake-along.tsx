import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bake-along")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/bake-along"!</div>;
}
