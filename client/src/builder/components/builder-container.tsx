import { ReactFlowProvider } from "@xyflow/react";
import { Builder, BuilderProps } from "./builder";
import { BuilderContextProvider } from "../hooks/use-builder-store";

export const BuilderContainer = ({
  refresh,
  ...props
}: BuilderProps & { refresh: () => void }) => {
  return (
    <BuilderContextProvider value={{ refresh }}>
      <ReactFlowProvider>
        <Builder {...props} />
      </ReactFlowProvider>
    </BuilderContextProvider>
  );
};
