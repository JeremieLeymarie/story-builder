import { ReactFlowProvider } from "@xyflow/react";
import { Builder } from "./builder";
import { BuilderContextProvider } from "../hooks/use-builder-context";
import { Scene, Story } from "@/lib/storage/domain";
import { RefreshFunction } from "./types";
import { BuilderServicePort } from "@/domains/builder/ports/builder-service-port";
import { useDetectBuilderErrors } from "../hooks/use-detect-builder-errors";

export const BuilderContainer = ({
  refresh,
  story,
  scenes,
  builderService,
}: {
  refresh: RefreshFunction;
  scenes: Scene[];
  story: Story;
  builderService: BuilderServicePort;
}) => {
  useDetectBuilderErrors({ scenes, builderService });

  return (
    // You can pass `debug` to the provider to enable helpful hints in the UI (scene keys, action keys)
    <BuilderContextProvider
      refresh={refresh}
      story={story}
      scenes={scenes}
      builderService={builderService}
      debug
    >
      <ReactFlowProvider>
        <Builder />
      </ReactFlowProvider>
    </BuilderContextProvider>
  );
};
