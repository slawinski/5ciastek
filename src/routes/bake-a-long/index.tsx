import { createFileRoute } from "@tanstack/react-router";
import { BakeAlongWizard } from "@/features/bake-a-long";

export const Route = createFileRoute("/bake-a-long/")({
  component: BakeAlongWizard,
});
