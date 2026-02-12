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
      <ToolbarTitle>Random Evenement</ToolbarTitle>
    </ToolbarHeader>
  );
};

export const RandomEventEditor = () => {
  const currentActions = useRandomEventStore((state) => state.action);
  const context = useBuilderContext();
  const sceneKey: string[] = [];
  currentActions?.targets.forEach((element) => {
    sceneKey.push(element.sceneKey);
  });
  sceneKey.reverse();
  const { data, isPending } = useQuery({
    queryKey: ["scenes"],
    queryFn: () => context.builderService.getScenesByKey(sceneKey),
  });
  if (!isPending && data)
    return (
      <ul>
        {currentActions?.targets?.map((t, i) => (
          <li key={i} className="flex items-center justify-between gap-2 py-1">
            <span className="max-w-[200px] truncate">
              {data[t.sceneKey]?.title}
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
