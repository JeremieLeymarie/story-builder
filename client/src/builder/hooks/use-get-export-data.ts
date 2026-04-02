import { useBuilderContext } from "./use-builder-context";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CharacterConfiguration,
  Scene,
  Story,
  StoryThemeConfig,
} from "@/lib/storage/domain";
import { getWikiService, WikiExportData } from "@/domains/wiki/wiki-service";
import { getThemeService } from "@/domains/builder/theme-service";
import { getCharacterService } from "@/domains/builder/character-service";
import { getJsonService } from "@/services/common/json-service";

const getExportData = (data: {
  story: Story;
  scenes: Scene[];
  wiki: WikiExportData | null;
  theme: StoryThemeConfig;
  characterConfig?: CharacterConfiguration;
}) => {
  const storyJson = JSON.stringify(data, null, 2);
  const result = getJsonService().parseJSON(storyJson);

  if (!result.isOk) {
    toast.error("Export failed", {
      description: result.error,
      duration: Number.POSITIVE_INFINITY,
    });
    return null;
  }

  const blob = new Blob([storyJson], { type: "text/json" });
  const url = URL.createObjectURL(blob);
  return { url, data: storyJson };
};

export const useGetExportData = () => {
  const {
    story: { key: storyKey },
    builderService,
  } = useBuilderContext();

  const {
    data,
    isPending,
    isLoading: isLoading_,
  } = useQuery({
    queryKey: ["get-export-data", storyKey],
    queryFn: async () => {
      // TODO: this logic should be in a service somewhere
      const { story, scenes } =
        await builderService.getBuilderStoryData(storyKey);

      if (!story) {
        toast.error("Something went wrong");
        return null;
      }

      const wiki = story.wikiKey
        ? await getWikiService().getWikiExportData(story.wikiKey)
        : null;

      const theme = await getThemeService().getTheme(storyKey);
      const characterConfig =
        await getCharacterService().getCharacter(storyKey);
      return {
        exportData: getExportData({
          story,
          scenes,
          wiki,
          theme,
          ...(characterConfig ? { characterConfig } : {}),
        }),
        story,
      };
    },
  });

  return { isLoading: isLoading_ || isPending || data === undefined, data };
};
