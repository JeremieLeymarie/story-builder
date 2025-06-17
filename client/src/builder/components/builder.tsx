import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  SelectionMode,
} from "@xyflow/react";
import { SceneNode } from "../nodes/scene/scene";
import { Toolbar } from "./toolbar";
import { useBuilder } from "../hooks/use-builder";
import { useBuilderContext } from "../hooks/use-builder-store";
import { getUserOS } from "@/lib/get-os";
import { SceneEditor } from "./editors/scene-editor";
import { useAddSceneEditorStore } from "../hooks/use-add-scene-editor-store";
import { useAddScene } from "../hooks/use-add-scene";
import { ActionsBar } from "./actions-bar";
import { FIT_VIEW_DURATION } from "../constants";

const nodeTypes = { scene: SceneNode };

export const Builder = () => {
  const {
    edges,
    nodes,
    onConnect,
    onEdgesChange,
    onNodeMove,
    onNodesChange,
    onNodesDelete,
    onEdgesDelete,
  } = useBuilder();
  const { isOpen: isOpenAddSceneEditor, setOpen: setOpenAddSceneEditor } =
    useAddSceneEditorStore();
  const { addScene } = useAddScene();
  const { reactFlowRef } = useBuilderContext();

  return (
    <div className="relative flex h-full w-full border">
      <div className="absolute top-5 left-5 flex flex-col gap-4">
        <Toolbar />
        <ActionsBar />
      </div>
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
        minZoom={0.1}
        defaultEdgeOptions={{ zIndex: 10000 }}
        selectionMode={SelectionMode.Full}
        nodesFocusable
        selectionOnDrag
        selectNodesOnDrag
        ref={reactFlowRef}
        fitView
        multiSelectionKeyCode={getUserOS() === "Mac" ? "Meta" : "ControlLeft"}
        fitViewOptions={{ duration: FIT_VIEW_DURATION }}
      >
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
