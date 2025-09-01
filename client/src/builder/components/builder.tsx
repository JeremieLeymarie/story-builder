import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  SelectionMode,
} from "@xyflow/react";
import { SceneNode } from "./nodes/scene/scene";
import { useBuilder } from "../hooks/use-builder";
import { useBuilderContext } from "../hooks/use-builder-context";
import { getUserOS } from "@/lib/get-os";
import { ActionsBar } from "./actions-bar";
import { FIT_VIEW_DURATION } from "../constants";
import { useBuilderEditorStore } from "../hooks/use-scene-editor-store";
import { BuilderMenu } from "./builder-menu";
import { EditorBar } from "./builder-editor-bar/editor-bar";

const nodeTypes = { scene: SceneNode } as const;

const BuilderFlow = () => {
  const { reactFlowRef, initialNodes, initialEdges } = useBuilderContext();
  const closeActiveEditor = useBuilderEditorStore((state) => state.close);
  const {
    onConnect,
    onConnectEnd,
    onEdgesDelete,
    onNodeDragStop,
    onBeforeNodesDelete,
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
      onBeforeDelete={onBeforeNodesDelete}
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
      tabIndex={0}
      autoFocus
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
        <BuilderMenu />
        <ActionsBar />
      </div>
      <div className="absolute top-5 right-5 flex flex-col gap-4">
        <EditorBar />
      </div>
      <BuilderFlow />
    </div>
  );
};
