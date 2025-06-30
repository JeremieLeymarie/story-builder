import { useNavigate } from "@tanstack/react-router";
import { OnSubmitStoryFormProps } from "../components/story-form/story-form-dialog";
import { toast } from "sonner";
import { getBuilderService } from "@/get-builder-service";

export const useBuilderStories = () => {
  const navigate = useNavigate();
  const builderService = getBuilderService();

  const handleCreateStory = async (storyData: OnSubmitStoryFormProps) => {
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

  const handleImportFromJSON = async (fileContent: string) => {
    const { error, data } = await builderService.importFromJSON(fileContent);

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

  return { handleCreateStory, handleImportFromJSON };
};
