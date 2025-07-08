/* eslint-disable react-refresh/only-export-components */
import { Scene, Story } from "@/lib/storage/domain";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef,
} from "react";
import { BuilderNode } from "../types";
import { Edge } from "@xyflow/react";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { RefreshFunction } from "../components/types";

type BuilderContext = {
  refresh: RefreshFunction;
  reactFlowRef: RefObject<HTMLDivElement | null>;
  story: Story;
  scenes: Scene[];
  nodes: BuilderNode[];
  edges: Edge[];
};

export const BuilderContext = createContext<BuilderContext | null>(null);

export const BuilderContextProvider = ({
  children,
  scenes,
  story,
  refresh,
}: PropsWithChildren<Pick<BuilderContext, "story" | "scenes" | "refresh">>) => {
  const reactFlowRef = useRef<HTMLDivElement>(null);

  const [nodes, edges] = scenesToNodesAndEdgesAdapter({ scenes, story });

  return (
    <BuilderContext.Provider
      value={{
        reactFlowRef,
        nodes,
        edges,
        scenes,
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
