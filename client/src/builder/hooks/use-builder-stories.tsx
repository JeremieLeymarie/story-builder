import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form/story-form-dialog";

export const useBuilderStories = () => {
  const navigate = useNavigate();

  const handleCreateStory = useCallback(
    async (storyData: OnSubmitStoryFormProps) => {
      const repo = getLocalRepository();
      const user = await repo.getUser();

      const story = await repo.createStoryWithFirstScene({
        story: {
          ...storyData,
          status: "draft",
          creationDate: new Date(),
          ...(user && { author: { username: user.username, key: user.key } }),
        },
        firstScene: {
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
        },
      });

      navigate({
        to: "/builder/$storyKey",
        params: { storyKey: story.key },
      });
    },
    [navigate],
  );

  return { handleCreateStory };
};
