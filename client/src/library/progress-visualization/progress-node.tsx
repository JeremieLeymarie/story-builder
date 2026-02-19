import { Handle, NodeProps, Position } from "@xyflow/react";
import { ProgressNodeType } from "./adapters";
import { useVisualizationContext } from "./hooks/use-visualization-context";
import { Card, CardHeader, CardTitle } from "@/design-system/primitives";
import { cn } from "@/lib/style";

const ANYTHING_BUT_WHITESPACES_REGEXP = /[^\s]/g;

export const ProgressNode = ({ data }: NodeProps<ProgressNodeType>) => {
  const { progress } = useVisualizationContext();
  const isVisited = progress.history.includes(data.key);

  const title = isVisited
    ? data.title
    : data.title.replaceAll(ANYTHING_BUT_WHITESPACES_REGEXP, "?");

  return (
    <Card
      size="sm"
      className={cn(
        "group relative w-60",
        isVisited ? "bg-primary" : "bg-muted/75",
      )}
    >
      <CardHeader>
        <CardTitle className={cn(!isVisited && "tracking-wide")}>
          {title}
        </CardTitle>
      </CardHeader>
      <Handle type="target" position={Position.Left} className="invisible!" />
      <Handle type="source" position={Position.Right} className="invisible!" />
    </Card>
  );
};
