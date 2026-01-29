/* eslint-disable react-refresh/only-export-components */
import { Scene, Story } from "@/lib/storage/domain";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { BuilderNode, BuilderEdge } from "../types";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { RefreshFunction } from "../components/types";
import { BuilderServicePort } from "@/domains/builder/ports/builder-service-port";

type BuilderContext = {
  refresh: RefreshFunction;
  reactFlowRef: RefObject<HTMLDivElement | null>;
  story: Story;
  setStory: Dispatch<SetStateAction<Story>>;
  initialNodes: BuilderNode[];
  initialEdges: BuilderEdge[];
  builderService: BuilderServicePort;
  debug: boolean;
};

export const BuilderContext = createContext<BuilderContext | null>(null);

export const BuilderContextProvider = ({
  children,
  scenes,
  story: story_,
  refresh,
  debug = false,
  builderService,
}: PropsWithChildren<{
  scenes: Scene[];
  story: Story;
  refresh: RefreshFunction;
  debug?: boolean;
  builderService: BuilderServicePort;
}>) => {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const [story, setStory] = useState(story_);

  const [initialNodes, initialEdges] = scenesToNodesAndEdgesAdapter({
    scenes,
    story: story_,
  });

  return (
    <BuilderContext.Provider
      value={{
        reactFlowRef,
        initialNodes,
        initialEdges,
        story,
        setStory,
        refresh,
        builderService,
        debug,
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
