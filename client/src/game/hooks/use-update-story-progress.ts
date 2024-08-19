import { Scene, StoryProgress } from "@/lib/storage/domain";
import { getGameService } from "@/services";
import { useCallback, useEffect } from "react";

type Props = {
  scene?: Scene | null;
  storyProgress?: StoryProgress | null;
};

/**
 * Handle the update of story progress on load
 * Update the current scene, the history and checks if the scene is the last scene
 *
 * @param scene the current scene
 * @param storyProgress the story progress linked to this user and story
 * @returns the updated story progress
 */
export const useUpdateStoryProgress = ({ scene, storyProgress }: Props) => {
  const gameService = getGameService();

  const updateStoryProgress = useCallback(
    async (progress: StoryProgress, scene: Scene) => {
      await gameService.saveProgress(progress, {
        currentSceneKey: scene.key,
        sceneActions: scene.actions,
      });
    },
    [gameService],
  );

  useEffect(() => {
    if (storyProgress && scene) updateStoryProgress(storyProgress, scene);
  }, [storyProgress, scene, updateStoryProgress]);
};
