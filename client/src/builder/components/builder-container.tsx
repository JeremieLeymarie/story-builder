import { ReactFlowProvider } from "@xyflow/react";
import { Builder, BuilderProps } from "./builder";
import { BuilderContextProvider } from "../hooks/use-builder-store";

export const BuilderContainer = ({
  refresh,
  story,
  scenes,
}: BuilderProps & { refresh: () => void }) => {
  return (
    <BuilderContextProvider refresh={refresh} storyKey={story.key}>
      <ReactFlowProvider>
        <Builder story={story} scenes={scenes} />
      </ReactFlowProvider>
    </BuilderContextProvider>
  );
};
