import { ReactFlowProvider } from "@xyflow/react";
import { Builder } from "./builder";
import { BuilderContextProvider } from "../hooks/use-builder-store";
import { Scene, Story } from "@/lib/storage/domain";

export const BuilderContainer = ({
  refresh,
  story,
  scenes,
}: {
  refresh: () => void;
  scenes: Scene[];
  story: Story;
}) => {
  return (
    <BuilderContextProvider refresh={refresh} story={story} scenes={scenes}>
      <ReactFlowProvider>
        <Builder />
      </ReactFlowProvider>
    </BuilderContextProvider>
  );
};
