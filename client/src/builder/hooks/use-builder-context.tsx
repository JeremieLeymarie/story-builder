/* eslint-disable react-refresh/only-export-components */
import { Scene, Story } from "@/lib/storage/domain";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import { BuilderNode } from "../types";
import { Edge } from "@xyflow/react";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { RefreshFunction } from "../components/types";
import { useSceneEditorStore } from "../components/scene-editor/hooks/use-scene-editor-store";

type BuilderContext = {
  refresh: RefreshFunction;
  reactFlowRef: RefObject<HTMLDivElement | null>;
  story: Story;
  nodes: BuilderNode[];
  edges: Edge[];
};

export const BuilderContext = createContext<BuilderContext | null>(null);

export const BuilderContextProvider = ({
  children,
  scenes,
  story,
  refresh,
}: PropsWithChildren<{
  scenes: Scene[];
  story: Story;
  refresh: RefreshFunction;
}>) => {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const { close } = useSceneEditorStore();

  const [nodes, edges] = scenesToNodesAndEdgesAdapter({ scenes, story });

  // Make sure that the scene editor is closed when another story is loaded in the builder
  useEffect(() => {
    close();
  }, [close]);

  return (
    <BuilderContext.Provider
      value={{
        reactFlowRef,
        nodes,
        edges,
        story,
        refresh,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilderContext = () => {
  const context = useContext(BuilderContext);

  if (!context)
    throw new Error(
      "useBuilderContext must be used within a BuilderContextProvider. Did you forget to wrap your component in a BuilderContextProvider?",
    );

  return context;
};
