/* eslint-disable react-refresh/only-export-components */
import { StoryProgress } from "@/lib/storage/domain";
import { createContext, ReactNode, useContext } from "react";

type VisualizationContextType = {
  progress: StoryProgress;
};

const VisualizationContext = createContext<VisualizationContextType | null>(
  null,
);

export const VisualizationContextProvider = ({
  children,
  progress,
}: {
  children: ReactNode;
  progress: StoryProgress;
}) => {
  return (
    <VisualizationContext.Provider value={{ progress }}>
      {children}
    </VisualizationContext.Provider>
  );
};

export const useVisualizationContext = () => {
  const context = useContext(VisualizationContext);

  if (!context)
    throw new Error(
      "useVisualizationContext must be used within a VisualizationContextProvider. Did you forget to wrap your component in a VisualizationContextProvider?",
    );

  return context;
};
