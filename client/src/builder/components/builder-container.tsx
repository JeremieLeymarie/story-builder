import { ReactFlowProvider } from "@xyflow/react";
import { Builder, BuilderProps } from "./builder";

export const BuilderContainer = (props: BuilderProps) => {
  return (
    <ReactFlowProvider>
      <Builder {...props} />
    </ReactFlowProvider>
  );
};
