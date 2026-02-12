import {
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { useRandomEventStore } from "@/builder/hooks/use-random-event-store";
import { Input } from "@/design-system/primitives/input";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useQuery } from "@tanstack/react-query";

export const RandomEventEditorHeader = () => {
  return (
    <ToolbarHeader>
      <ToolbarTitle>Random Events</ToolbarTitle>
    </ToolbarHeader>
  );
};

export const RandomEventEditor = () => {
  const currentAction = useRandomEventStore((state) => state.action);
  if (!currentAction || currentAction.targets.length < 2)
    throw new Error(
      "RandomEventEditor shouldn't be rendered when useRandomEventStore is empty, or when the selected action has less than 2 targets",
    );

  const { builderService } = useBuilderContext();
  const sceneKeys = currentAction.targets.map((target) => target.sceneKey);
  const { data: sceneByKey, isPending } = useQuery({
    queryKey: ["get-scenes", sceneKeys],
    queryFn: async () => {
      return await builderService.getScenesByKey(sceneKeys);
    },
  });

  if (!isPending && sceneByKey)
    return (
      <ul>
        {currentAction?.targets?.map((t) => (
          <li
            key={t.sceneKey}
            className="flex items-center justify-between gap-2 py-1"
          >
            <span className="max-w-[200px] truncate">
              {sceneByKey[t.sceneKey]?.title}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <Input
                type="number"
                defaultValue={t.probability}
                className="w-16 px-2 py-1 text-sm"
              />
              <span>%</span>
            </div>
          </li>
        ))}
      </ul>
    );
};
