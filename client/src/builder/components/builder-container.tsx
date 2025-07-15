import { ReactFlowProvider } from "@xyflow/react";
import { Builder } from "./builder";
import { BuilderContextProvider } from "../hooks/use-builder-context";
import { Scene, Story } from "@/lib/storage/domain";
import { RefreshFunction } from "./types";

export const BuilderContainer = ({
  refresh,
  story,
  scenes,
}: {
  refresh: RefreshFunction;
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
