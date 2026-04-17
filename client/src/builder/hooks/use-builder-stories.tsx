import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getImportExportService } from "@/services/common/import-export-service";
import { Story } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";
import { JsonStoryData } from "@/services/common/schema";
import { getBuilderService } from "@/get-builder-service";

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

  const handleImportFromJSON = async (storyFromImport: JsonStoryData) => {
    try {
      const storyKey = await builderService.importStory(storyFromImport);
      if (!storyKey) throw new Error("Data should be defined");
      navigate({
        to: "/builder/$storyKey",
        params: { storyKey },
      });
      toast.success("Import complete!", {
        description: "You can start working on this story in the builder!",
      });
    } catch (error) {
      toast.error("Import failed!", {
        description: (error as Error).message,
        duration: Number.POSITIVE_INFINITY,
      });
    }
  };

  const parseFile = (content: string) => {
    const result = getImportExportService().parseJSON(content);

    if (!result.isOk) {
      toast.error("Import failed", {
        description: result.error,
        duration: Number.POSITIVE_INFINITY,
      });
      return null;
    }
    return result.data;
  };

  return { createStory, parseFile, handleImportFromJSON };
};
