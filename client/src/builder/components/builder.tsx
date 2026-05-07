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
import { useBuilderEditorStore } from "../hooks/use-builder-editor-store";
import { EditorBar } from "./builder-editor-bar/editor-bar";
import { BuilderToolbar } from "./builder-toolbar";
import CustomEdge from "./edges/custom-edge";
import { BuilderErrorsToolbar } from "./builder-errors-toolbar";
import { DeleteSceneModal } from "./delete-scenes-modal";

const nodeTypes = { scene: SceneNode } as const;
const edgeTypes = { edge: CustomEdge } as const;

const BuilderFlow = () => {
  const { reactFlowRef, initialNodes, initialEdges } = useBuilderContext();
  const closeActiveEditor = useBuilderEditorStore((state) => state.close);
  const {
    controlsEnabled,
    onConnect,
    onConnectEnd,
    onEdgesDelete,
    onNodeDragStop,
    onBeforeDelete,
    onInit,
  } = useBuilder();

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      defaultEdgeOptions={{ zIndex: 1 }}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onEdgesDelete={onEdgesDelete}
      onNodeDragStop={onNodeDragStop}
      onBeforeDelete={onBeforeDelete}
      onInit={onInit}
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
      zoomOnScroll={controlsEnabled}
      panOnScroll={controlsEnabled}
      zoomOnPinch={controlsEnabled}
      nodesDraggable={controlsEnabled}
      panOnDrag={controlsEnabled}
    >
      <MiniMap
        position="bottom-left"
        nodeBorderRadius={8}
        className="[&>svg]:rounded-lg"
      />
      <Background variant={BackgroundVariant.Dots} gap={25} size={1.5} />
    </ReactFlow>
  );
};

export const Builder = () => (
  <div className="relative flex h-full w-full border">
    <DeleteSceneModal />
    <div className="absolute top-5 left-5 flex max-w-67.5 flex-col gap-4">
      <BuilderToolbar />
      <ActionsBar />
      <BuilderErrorsToolbar />
    </div>
    <div className="absolute top-5 right-5 flex flex-col gap-4">
      <EditorBar />
    </div>
    <BuilderFlow />
  </div>
);
