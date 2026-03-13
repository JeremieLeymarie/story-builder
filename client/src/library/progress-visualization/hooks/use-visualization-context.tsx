/* eslint-disable react-refresh/only-export-components */
import { AnalyticsServicePort } from "@/domains/game/analytics-service";
import { createContext, ReactNode, useContext } from "react";

type VisualizationContextType = {
  analyticsService: AnalyticsServicePort;
};

const VisualizationContext = createContext<VisualizationContextType | null>(
  null,
);

// Maybe this should not be specific to the progress visualization but global to the whole analytics UI instead?
export const VisualizationContextProvider = ({
  children,
  analyticsService,
}: {
  children: ReactNode;
  analyticsService: AnalyticsServicePort;
}) => {
  return (
    <VisualizationContext.Provider value={{ analyticsService }}>
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
