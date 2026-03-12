import {
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useQuery } from "@tanstack/react-query";
import { Action, Scene } from "@/lib/storage/domain";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { RandomEventsForm } from "./random-events-form";

const useTargetScenes = (sceneKeys: string[]) => {
  const { builderService } = useBuilderContext();

  const { data: scenesByKey, isLoading } = useQuery({
    queryKey: ["get-target-scenes", sceneKeys],
    queryFn: async () => {
      return await builderService.getScenesByKey(sceneKeys);
    },
  });

  return { scenesByKey, isLoading };
};

export const RandomEventEditorHeader = () => {
  return (
    <ToolbarHeader>
      <ToolbarTitle>Random Events</ToolbarTitle>
    </ToolbarHeader>
  );
};

export const RandomEventEditor = ({
  action,
  sourceScene,
}: {
  action: Action;
  sourceScene: Scene;
}) => {
  const sceneKeys = action.targets.map((t) => t.sceneKey);
  const { scenesByKey, isLoading } = useTargetScenes(sceneKeys);
  if (isLoading || scenesByKey === undefined) return <SimpleLoader />;

  return (
    <RandomEventsForm
      scenesByKey={scenesByKey}
      action={action}
      sourceScene={sourceScene}
    />
  );
};
