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
import { SceneEditor } from "./editors/scene-editor";
import { useAddSceneEditorStore } from "../hooks/use-add-scene-editor-store";
import { useAddScene } from "../hooks/use-add-scene";

const nodeTypes = { scene: SceneNode };

export type BuilderProps = { story: Story; scenes: Scene[] };

export const Builder = ({ story, scenes }: BuilderProps) => {
  const { reactFlowRef } = useBuilderContext();
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
  const { isOpen: isOpenAddSceneEditor, setOpen: setOpenAddSceneEditor } =
    useAddSceneEditorStore();
  const { addScene } = useAddScene();

  return (
    <div className="relative flex h-full w-full border">
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
        <Background variant={BackgroundVariant.Dots} gap={25} size={1} />
      </ReactFlow>

      <SceneEditor
        open={isOpenAddSceneEditor}
        setOpen={setOpenAddSceneEditor}
        onSave={addScene}
      />
    </div>
  );
};
