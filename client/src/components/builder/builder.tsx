import { useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { BuilderNode } from "./types";
import { SceneNode } from "./nodes/scene/scene";

const initialNodes: BuilderNode[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "scene",
    data: {
      title: "Scene #1",
      content:
        "You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.You're at a crossroads. On the left, the forest, on the right, the village.",
      actions: [
        { text: "Go into the forest" },
        { text: "Walk towards the village" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 300, y: 0 },
    type: "scene",
    data: {
      title: "Forest",
      content: "You're in a forest",
      actions: [{ text: "Go back to the crossroads" }],
    },
  },
];
const initialEdges = [];

const nodeTypes = { scene: SceneNode };

export const Builder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full border">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        minZoom={0.05}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
