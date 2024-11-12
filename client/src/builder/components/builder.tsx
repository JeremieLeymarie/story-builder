import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  SelectionMode,
} from "@xyflow/react";
import { SceneNode } from "../nodes/scene/scene";
import { Toolbar } from "./toolbar";
import { useBuilder } from "../hooks/use-builder";
import { Scene, Story } from "@/lib/storage/domain";
import { useBuilderContext } from "../hooks/use-builder-store";
import { getUserOS } from "@/lib/get-os";

const nodeTypes = { scene: SceneNode };

export type BuilderProps = { story: Story; scenes: Scene[] };

export const Builder = ({ story, scenes }: BuilderProps) => {
  const {
    edges,
    nodes,
    onConnect,
    onEdgesChange,
    onNodeMove,
    onNodesChange,
    onNodesDelete,
    onEdgesDelete,
  } = useBuilder({ scenes, story });
  const { reactFlowRef } = useBuilderContext();

  return (
    <div className="flex h-full w-full border">
      <Toolbar story={story} scenes={scenes} />
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeMove}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
        minZoom={0.2}
        defaultEdgeOptions={{ zIndex: 10000 }}
        selectionMode={SelectionMode.Full}
        nodesFocusable
        selectionOnDrag
        selectNodesOnDrag
        ref={reactFlowRef}
        fitView
        multiSelectionKeyCode={getUserOS() === "Mac" ? "Meta" : "ControlLeft"}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
