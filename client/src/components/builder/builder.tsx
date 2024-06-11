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
import { SceneNode } from "./nodes/scene";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "scene",
    data: {
      title: "Scene #1",
      content:
        "You're at a crossroads. On the left, the forest, on the right, the village.",
      actions: [
        { text: "Go into the forest" },
        { text: "Walk towards the village" },
      ],
    },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

type NodeType = "scene";

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
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
