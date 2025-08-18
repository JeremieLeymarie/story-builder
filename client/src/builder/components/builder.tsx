import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  SelectionMode,
} from "@xyflow/react";
import { SceneNode } from "./nodes/scene/scene";
import { Toolbar } from "./toolbar";
import { BuilderMeta, useBuilder } from "../hooks/use-builder";
import { useBuilderContext } from "../hooks/use-builder-context";
import { getUserOS } from "@/lib/get-os";
import { ActionsBar } from "./actions-bar";
import { FIT_VIEW_DURATION } from "../constants";
import { SceneEditor } from "./scene-editor/scene-editor-drawer";
import { useSceneEditorStore } from "./scene-editor/hooks/use-scene-editor-store";
import { useBuilderActions } from "../hooks/use-builder-actions";

const nodeTypes = { scene: SceneNode };

const BuilderFlow = ({ attributes }: BuilderMeta) => {
  const { reactFlowRef } = useBuilderContext();
  const { close: closeNewEditor } = useSceneEditorStore();

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      {...attributes}
      minZoom={0.1}
      defaultEdgeOptions={{ zIndex: 10000 }}
      selectionMode={SelectionMode.Partial}
      nodesFocusable
      selectionOnDrag
      selectNodesOnDrag
      ref={reactFlowRef}
      fitView
      multiSelectionKeyCode={getUserOS() === "Mac" ? "Meta" : "ControlLeft"}
      fitViewOptions={{ duration: FIT_VIEW_DURATION }}
      onPaneClick={closeNewEditor}
    >
      <MiniMap position="bottom-left" />
      <Background variant={BackgroundVariant.Dots} gap={25} size={1.5} />
    </ReactFlow>
  );
};

export const Builder = () => {
  const { updateScene } = useBuilderActions();
  const builder = useBuilder();

  return (
    <div className="relative flex h-full w-full border">
      <div className="absolute top-5 left-5 flex flex-col gap-4">
        <Toolbar setNodes={builder.setNodes} />
        <ActionsBar />
      </div>
      <div className="absolute top-5 right-5 flex flex-col gap-4">
        <SceneEditor onSave={updateScene} />
      </div>
      <BuilderFlow {...builder} />
    </div>
  );
};
