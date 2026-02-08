import { Card, CardHeader, CardTitle } from "@/design-system/primitives";
import { getBuilderService } from "@/get-builder-service";
import { Scene, Story, StoryProgress } from "@/lib/storage/domain";
import { cn } from "@/lib/style";
import { useQuery } from "@tanstack/react-query";
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  Edge,
  EdgeProps,
  getBezierPath,
  Handle,
  Node,
  NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { createContext, ReactNode, useContext } from "react";

type SceneNode = Node<
  {
    key: string;
    title: string;
  },
  "scene"
>;

const scenesToNodesAndEdgesAdapter = (
  scenes: Scene[],
): [SceneNode[], Edge[]] => {
  const nodes = scenes.map((scene) => ({
    id: scene.key,
    type: "scene",
    position: {
      x: scene.builderParams.position.x,
      y: scene.builderParams.position.y,
    },
    data: {
      key: scene.key,
      title: scene.title,
    },
  })) satisfies SceneNode[];

  const edges = scenes.flatMap((scene) =>
    scene.actions.flatMap((action) =>
      action.targets.map((target) => ({
        id: `${action.key}-${target.sceneKey}`,
        type: "edge",
        source: scene.key,
        target: target.sceneKey,
      })),
    ),
  ) satisfies Edge[];
  return [nodes, edges] as const;
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
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
  const { progress } = useVisualizationContext();
  const isVisited = progress.history.some((sceneKey) => sceneKey === target);

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

const ANYTHING_BUT_WHITESPACES_REGEXP = /[^\s]/g;

const SceneNodeComponent = ({ data }: NodeProps<SceneNode>) => {
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

const nodeTypes = { scene: SceneNodeComponent } as const;
const edgeTypes = { edge: CustomEdge } as const;

type VisualizationContextType = {
  progress: StoryProgress;
};

const VisualizationContext = createContext<VisualizationContextType | null>(
  null,
);

export const VisualizationContextProvider = ({
  children,
  progress,
}: {
  children: ReactNode;
  progress: StoryProgress;
}) => {
  return (
    <VisualizationContext.Provider value={{ progress }}>
      {children}
    </VisualizationContext.Provider>
  );
};

const useVisualizationContext = () => {
  const context = useContext(VisualizationContext);

  if (!context)
    throw new Error(
      "useVisualizationContext must be used within a VisualizationContextProvider. Did you forget to wrap your component in a VisualizationContextProvider?",
    );

  return context;
};

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
