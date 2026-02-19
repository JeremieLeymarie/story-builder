import {
  Background,
  BackgroundVariant,
  Edge,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { ProgressNode } from "./progress-node";
import { ProgressEdge } from "./progress-edge";
import { ProgressNodeType, scenesToNodesAndEdgesAdapter } from "./adapters";
import { VisualizationContextProvider } from "./hooks/use-visualization-context";
import { AnalyticsServicePort } from "@/domains/game/analytics-service";
import { useEffect, useEffectEvent } from "react";
import { Button } from "@/design-system/primitives";
import { RotateCcwIcon } from "lucide-react";
import { FIT_VIEW_DURATION } from "@/builder/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";

const nodeTypes = { scene: ProgressNode } as const;
const edgeTypes = { edge: ProgressEdge } as const;

const Flow = ({
  nodes,
  edges,
}: {
  nodes: ProgressNodeType[];
  edges: Edge[];
}) => {
  const { fitView } = useReactFlow();

  const handleResize = useEffectEvent(() => {
    fitView();
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-100 w-full rounded-lg border">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-sm"
            variant="outline"
            className="absolute -top-8 right-0"
            onClick={() => fitView({ duration: FIT_VIEW_DURATION })}
          >
            <RotateCcwIcon size={8} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset view</TooltipContent>
      </Tooltip>

      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultNodes={nodes}
        defaultEdges={edges}
        fitView
        minZoom={0.05}
      >
        <Background
          color="var(--secondary)"
          gap={25}
          variant={BackgroundVariant.Cross}
        />
      </ReactFlow>
    </div>
  );
};

export const StoryProgressVisualization = ({
  analyticsService,
}: {
  analyticsService: AnalyticsServicePort;
}) => {
  const [nodes, edges] = scenesToNodesAndEdgesAdapter(
    analyticsService.getAllScenes(),
  );

  return (
    <VisualizationContextProvider analyticsService={analyticsService}>
      <ReactFlowProvider>
        <Flow nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </VisualizationContextProvider>
  );
};
