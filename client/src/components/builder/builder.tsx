import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "reactflow";
import { SceneNode } from "./nodes/scene/scene";
import { Toolbar } from "./toolbar";
import { Scene } from "@/lib/storage/dexie-db";
import { useBuilder } from "./hooks/use-builder";

const nodeTypes = { scene: SceneNode };

type BuilderProps = { storyId: number; scenes: Scene[] };

export const Builder = ({ storyId, scenes }: BuilderProps) => {
  const { edges, nodes, onConnect, onEdgesChange, onNodeMove, onNodesChange } =
    useBuilder({ scenes });

  return (
    <div className="w-full h-full border flex">
      <Toolbar storyId={storyId} />
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeMove}
        minZoom={0.05}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
