import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getImportExportService } from "@/services/common/import-export-service";
import { JsonStoryData } from "@/services/common/schema";
import { getBuilderService } from "@/get-builder-service";
import { CreateStorySchemaOutput } from "./use-create-story-form";
import { DEFAULT_STORY_IMAGE_URL } from "../constants";
import { useMutation } from "@tanstack/react-query";

export const useBuilderStories = () => {
  const navigate = useNavigate();
  const builderService = getBuilderService();

  const { mutateAsync: createStory, isPending: isCreatingStory } = useMutation({
    mutationFn: async (storyData: CreateStorySchemaOutput) => {
      return builderService.createStoryWithFirstScene({
        title: storyData.title,
        genres: storyData.genres ?? [],
        description: storyData.description ?? "",
        image: storyData.image ?? DEFAULT_STORY_IMAGE_URL,
      });
    },
    onSuccess: (result) => {
      if (!result)
        return toast.error(
          "Could not create a new story. Please try again later",
        );

      navigate({
        to: "/builder/$storyKey",
        params: { storyKey: result.story.key },
      });
    },
  });

  const handleImportFromJSON = async (storyFromImport: JsonStoryData) => {
    try {
      const storyKey = await builderService.importStory(storyFromImport);
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

  return { createStory, isCreatingStory, parseFile, handleImportFromJSON };
};
