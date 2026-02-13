import {
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { Input } from "@/design-system/primitives/input";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useQuery } from "@tanstack/react-query";
import { Action } from "@/lib/storage/domain";
import { SimpleLoader } from "@/design-system/components/simple-loader";

const useTargetScenes = (sceneKeys: string[]) => {
  const { builderService } = useBuilderContext();

  const { data: sceneByKey, isLoading } = useQuery({
    queryKey: ["get-target-scenes", sceneKeys],
    queryFn: async () => {
      return await builderService.getScenesByKey(sceneKeys);
    },
  });

  return { sceneByKey, isLoading };
};

export const RandomEventEditorHeader = () => {
  return (
    <ToolbarHeader>
      <ToolbarTitle>Random Events</ToolbarTitle>
    </ToolbarHeader>
  );
};

export const RandomEventEditor = ({ action }: { action: Action }) => {
  const sceneKeys = action.targets.map((t) => t.sceneKey);
  const { sceneByKey, isLoading } = useTargetScenes(sceneKeys);

  if (isLoading || sceneByKey === undefined) return <SimpleLoader />;

  return (
    <ul>
      {action?.targets?.map((t) => (
        <li
          key={t.sceneKey}
          className="flex items-center justify-between gap-2 py-1"
        >
          <span className="max-w-[200px] truncate">
            {sceneByKey[t.sceneKey]?.title || (
              <span className="text-muted-foreground italic">
                Untitled Scene
              </span>
            )}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <Input
              type="number"
              value={t.probability}
              className="w-16 px-2 py-1 text-sm"
            />
            <span>%</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
