import { Builder } from "@/components/builder/builder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/builder")({
  component: () => (
    <div className="h-full w-full">
      <Builder />
    </div>
  ),
});
