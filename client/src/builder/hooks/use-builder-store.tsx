/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef,
} from "react";

type BuilderContext = {
  refresh: () => void;
  reactFlowRef: RefObject<HTMLDivElement | null>;
  storyKey: string;
};

export const BuilderContext = createContext<BuilderContext | null>(null);

export const BuilderContextProvider = ({
  storyKey,
  refresh,
  children,
}: PropsWithChildren<Omit<BuilderContext, "reactFlowRef">>) => {
  const reactFlowRef = useRef<HTMLDivElement>(null);

  return (
    <BuilderContext.Provider
      value={{
        storyKey,
        refresh,
        reactFlowRef,
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
