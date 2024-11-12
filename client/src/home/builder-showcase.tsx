import { SceneNode } from "@/builder/nodes/scene/scene";
import { SceneNodeType } from "@/builder/types";
import { Title } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Edge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { BuilderContextProvider } from "@/builder/hooks/use-builder-store";

const nodeTypes = { scene: SceneNode };

const NODES: SceneNodeType[] = [
  {
    data: {
      title: "A mysterious crossroads",
      content:
        "You arrive at a crossroads. On the left, a sinuous dirt path leads to a tree mass. The road on the right is a well-maintained paved trail that runs towards a little village in the hills.",
      actions: [{ text: "Go to the forest" }, { text: "Go to the village" }],
      isFirstScene: false,
      key: "first-fake-scene-key",
      storyKey: "fake-story-key",
      isEditable: false,
    },
    id: "scene-1",
    position: { x: 50, y: 150 },
    type: "scene",
  },
  {
    data: {
      title: "The Forest",
      content:
        "After half an hour of walking under the bright sun, you come close to the trees. As the air gets colder, you start hearing birds and other creatures of the forest",
      actions: [],
      isFirstScene: false,
      key: "forest-fake-scene-key",
      storyKey: "fake-story-key",
      isEditable: false,
    },
    id: "scene-2",
    position: { x: 550, y: 50 },
    type: "scene",
  },
  {
    data: {
      title: "The Road to the Village",
      content:
        "You walk alongside an - for most of it - even path that leads you under the protecting shadows of the hills. You maintain a quick pace. After a moment, you begin feeling like something is watching you.",
      actions: [],
      isFirstScene: false,
      key: "village-fake-scene-key",
      storyKey: "fake-story-key",
      isEditable: false,
    },
    id: "scene-3",
    position: { x: 550, y: 350 },
    type: "scene",
  },
];

const EDGES: Edge[] = [
  {
    id: "edge-1",
    source: "scene-1",
    target: "scene-2",
    sourceHandle: "first-fake-scene-key-0",
  },
  {
    id: "edge-2",
    source: "scene-1",
    target: "scene-3",
    sourceHandle: "first-fake-scene-key-1",
  },
];

export const BuilderShowcase = () => {
  const [nodes, , onNodesChange] = useNodesState(NODES);
  const [edges, , onEdgesChange] = useEdgesState(EDGES);

  return (
    <div className="flex h-[400px] w-full bg-primary max-lg:h-fit max-lg:flex-col">
      <div className="flex h-full w-5/12 items-center max-lg:w-full max-lg:py-8">
        <div className="flex w-full flex-col px-12">
          <Title variant="primary">Create your own stories!</Title>
          <p className="mt-4">
            The builder is an intuitive no-code graphical interface to help you
            create your own worlds.
          </p>
          <p className="mt-4">
            Story branches and soon to come conditions, UI customization,
            soundtrack, character creation, inventory management, templating...
          </p>
          <div className="mt-8 flex w-full justify-end">
            <Link to="/builder/stories">
              <Button variant="outline" className="flex gap-2">
                Go to the builder <MoveRightIcon size="16px" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-full w-7/12 bg-white max-lg:h-[400px] max-lg:w-full">
        <BuilderContextProvider value={{ refresh: () => {} }}>
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            minZoom={0.05}
            zoomOnScroll={false}
            panOnScroll={false}
            defaultEdgeOptions={{ zIndex: 10000 }}
            preventScrolling={false}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </BuilderContextProvider>
      </div>
    </div>
  );
};
