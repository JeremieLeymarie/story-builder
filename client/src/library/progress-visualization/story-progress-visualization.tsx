import { getBuilderService } from "@/get-builder-service";
import { Story, StoryProgress } from "@/lib/storage/domain";
import { useQuery } from "@tanstack/react-query";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { ProgressNode } from "./progress-node";
import { ProgressEdge } from "./progress-edge";
import { scenesToNodesAndEdgesAdapter } from "./adapters";
import { VisualizationContextProvider } from "./hooks/use-visualization-context";

const nodeTypes = { scene: ProgressNode } as const;
const edgeTypes = { edge: ProgressEdge } as const;

export const StoryProgressVisualization = ({
  story,
  progress,
}: {
  story: Story;
  progress: StoryProgress;
}) => {
  const { data: storyData } = useQuery({
    queryKey: ["get-story-progress"],
    queryFn: async () => {
      // TODO: use library service or dedicated analytics service
      return getBuilderService().getBuilderStoryData(story.key);
    },
  });

  if (!storyData) return null;

  const [nodes, edges] = scenesToNodesAndEdgesAdapter(storyData.scenes);

  return (
    <VisualizationContextProvider progress={progress}>
      <ReactFlowProvider>
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultNodes={nodes}
          defaultEdges={edges}
          fitView
          minZoom={0.05}
        >
          <Background variant={BackgroundVariant.Dots} gap={25} size={1.5} />
        </ReactFlow>
      </ReactFlowProvider>
    </VisualizationContextProvider>
  );
};
