import { ReactFlowProvider } from "@xyflow/react";
import { Builder } from "./builder";
import { BuilderContextProvider } from "../hooks/use-builder-context";
import { Scene, Story } from "@/lib/storage/domain";
import { RefreshFunction } from "./types";
import { useDetectBuilderErrors } from "../hooks/use-detect-builder-errors";
import { getCharacterService } from "@/domains/builder/character-service";
import { getBuilderService } from "@/get-builder-service";

export const BuilderContainer = ({
  refresh,
  story,
  scenes,
}: {
  refresh: RefreshFunction;
  scenes: Scene[];
  story: Story;
}) => {
  const builderService = getBuilderService();
  const characterService = getCharacterService();
  useDetectBuilderErrors({ scenes, builderService });

  return (
    // You can pass `debug` to the provider to enable helpful hints in the UI (scene keys, action keys)
    <BuilderContextProvider
      refresh={refresh}
      story={story}
      scenes={scenes}
      builderService={builderService}
      characterService={characterService}
    >
      <ReactFlowProvider>
        <Builder />
      </ReactFlowProvider>
    </BuilderContextProvider>
  );
};
