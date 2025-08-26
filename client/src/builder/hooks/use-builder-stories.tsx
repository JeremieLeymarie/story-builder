import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getBuilderService } from "@/get-builder-service";
import {
  getImportService,
  StoryFromImport,
} from "@/services/common/import-service";
import { Story } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type CreateStoryPayload = Omit<
  WithoutKey<Story>,
  "firstSceneKey" | "author" | "type" | "publicationDate" | "creationDate"
> & { firstSceneKey?: string };

export const useBuilderStories = () => {
  const navigate = useNavigate();
  const builderService = getBuilderService();

  const createStory = async (storyData: CreateStoryPayload) => {
    const result = await builderService.createStoryWithFirstScene(storyData);

    if (!result) {
      return toast.error(
        "Could not create a new story. Please try again later",
      );
    }

    navigate({
      to: "/builder/$storyKey",
      params: { storyKey: result.story.key },
    });
  };

  const handleImportFromJSON = async (storyFromImport: StoryFromImport) => {
    const { error, data } = await builderService.importStory(storyFromImport);

    if (error) {
      toast.error("Import failed!", { description: error });
      return;
    }
    if (!data) throw new Error("Data should be defined");

    navigate({
      to: "/builder/$storyKey",
      params: { storyKey: data.storyKey },
    });
    toast.success("Import complete!", {
      description: "You can start working on this story in the builder!",
    });
  };

  const parseFile = (content: string) => {
    const result = getImportService().parseJSON(content);

    if (!result.isOk) {
      toast.error("Import failed", { description: result.error });
      return null;
    }
    return result.data;
  };

  return { createStory, parseFile, handleImportFromJSON };
};
