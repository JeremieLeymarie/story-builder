import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form-dialog";

export const useBuilderStories = () => {
  const navigate = useNavigate();

  const handleCreateStory = useCallback(
    async (storyData: OnSubmitStoryFormProps) => {
      const repo = getLocalRepository();
      const story = await repo.createStory({ ...storyData, status: "draft" });

      // Create first scene with mock data
      const firstScene = await repo.createScene({
        storyId: story.id,
        builderParams: { position: { x: 0, y: 0 } },
        content: "This is a placeholder content for your first scene",
        title: "Your first scene",
        actions: [
          {
            text: "An action that leads to a scene",
          },
          {
            text: "An action that leads to another scene",
          },
        ],
      });
      repo.updateStory({ ...story, firstSceneId: firstScene.id });

      navigate({
        to: "/builder/$storyId",
        params: { storyId: story.id },
      });
    },
    [navigate],
  );

  return { handleCreateStory };
};
