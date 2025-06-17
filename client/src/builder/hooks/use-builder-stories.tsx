import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form/story-form-dialog";
import { getBuilderService } from "@/services";
import { toast } from "sonner";

export const useBuilderStories = () => {
  const navigate = useNavigate();

  const handleCreateStory = useCallback(
    async (storyData: OnSubmitStoryFormProps) => {
      const result =
        await getBuilderService().createStoryWithFirstScene(storyData);

      if (!result) {
        return toast.error(
          "Could not create a new story. Please try again later",
        );
      }

      navigate({
        to: "/builder/$storyKey",
        params: { storyKey: result.story.key },
      });
    },
    [navigate],
  );

  return { handleCreateStory };
};
