/* eslint-disable react-refresh/only-export-components */
import { createContext, PropsWithChildren, useContext } from "react";

type BuilderContext = {
  refresh: () => void;
};

export const BuilderContext = createContext<BuilderContext | null>(null);

export const BuilderContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: BuilderContext }>) => {
  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
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
