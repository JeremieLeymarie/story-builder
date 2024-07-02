import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "reactflow";
import { SceneNode } from "../nodes/scene/scene";
import { Toolbar } from "./toolbar";
import { useBuilder } from "../hooks/use-builder";
import { Scene, Story } from "@/lib/storage/dexie/dexie-db";

const nodeTypes = { scene: SceneNode };

type BuilderProps = { story: Story; scenes: Scene[] };

export const Builder = ({ story, scenes }: BuilderProps) => {
  const {
    edges,
    nodes,
    onConnect,
    onEdgesChange,
    onNodeMove,
    onNodesChange,
    onEdgesDelete,
  } = useBuilder({ scenes, story });

  return (
    <div className="w-full h-full border flex">
      <Toolbar storyId={story.id} />
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeMove}
        onEdgesDelete={onEdgesDelete}
        minZoom={0.05}
        onInit={(instance) => instance.fitView()}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
