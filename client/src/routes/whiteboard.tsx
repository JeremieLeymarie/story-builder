import { createFileRoute } from "@tanstack/react-router";
import { DrawingBoard } from "@/components/whiteboard";

export const Route = createFileRoute("/whiteboard")({
  component: () => <DrawingBoard />,
});
