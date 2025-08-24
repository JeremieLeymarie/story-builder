import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  SelectionMode,
} from "@xyflow/react";
import { SceneNode } from "./nodes/scene/scene";
import { Toolbar } from "./toolbar";
import { useBuilder } from "../hooks/use-builder";
import { useBuilderContext } from "../hooks/use-builder-context";
import { getUserOS } from "@/lib/get-os";
import { ActionsBar } from "./actions-bar";
import { FIT_VIEW_DURATION } from "../constants";
import { EditorBar } from "./builder-editors/editor-bar";
import { useBuilderEditorStore } from "./builder-editors/hooks/use-scene-editor-store";

const nodeTypes = { scene: SceneNode } as const;

const BuilderFlow = () => {
  const { reactFlowRef, initialNodes, initialEdges } = useBuilderContext();
  const closeActiveEditor = useBuilderEditorStore((state) => state.close);
  const {
    onConnect,
    onConnectEnd,
    onEdgesDelete,
    onNodeDragStop,
    onNodesDelete,
  } = useBuilder();

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      defaultEdgeOptions={{ zIndex: 10000 }}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onEdgesDelete={onEdgesDelete}
      onNodeDragStop={onNodeDragStop}
      onNodesDelete={onNodesDelete}
      nodeOrigin={[0, 0.5]}
      minZoom={0.1}
      selectionMode={SelectionMode.Partial}
      nodesFocusable
      selectionOnDrag
      selectNodesOnDrag
      ref={reactFlowRef}
      fitView
      multiSelectionKeyCode={getUserOS() === "Mac" ? "Meta" : "ControlLeft"}
      fitViewOptions={{ duration: FIT_VIEW_DURATION }}
      onPaneClick={closeActiveEditor}
    >
      <MiniMap position="bottom-left" />
      <Background variant={BackgroundVariant.Dots} gap={25} size={1.5} />
    </ReactFlow>
  );
};

export const Builder = () => {
  return (
    <div className="relative flex h-full w-full border">
      <div className="absolute top-5 left-5 flex flex-col gap-4">
        <Toolbar />
        <ActionsBar />
      </div>
      <div className="absolute top-5 right-5 flex flex-col gap-4">
        <EditorBar />
      </div>
      <BuilderFlow />
    </div>
  );
};
