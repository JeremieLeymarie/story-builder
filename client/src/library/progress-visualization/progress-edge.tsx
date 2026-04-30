import { BaseEdge, Edge, EdgeProps, getBezierPath } from "@xyflow/react";
import { useVisualizationContext } from "./hooks/use-visualization-context";
import { cn } from "@/lib/style";

export const ProgressEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  source,
  target,
  style,
}: EdgeProps<Edge>) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { analyticsService } = useVisualizationContext();
  const isVisited = analyticsService.isConnectionVisited({
    sourceSceneKey: source,
    targetSceneKey: target,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ ...style, ...(!isVisited && { strokeDasharray: "10" }) }}
      markerEnd={markerEnd}
      className={cn(isVisited && "stroke-primary! stroke-3!")}
    />
  );
};
