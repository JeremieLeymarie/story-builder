import { Scene, StoryProgress } from "@/lib/storage/domain";
import { useCallback, useEffect, useState } from "react";
import { getLocalRepository } from "@/repositories/indexed-db-repository";

type Props = {
  scene?: Scene | null;
  storyProgress?: StoryProgress | null;
};

const isLastScene = (scene: Scene) => {
  return !scene.actions.length;
};

/**
 * Add scene key to history if this is not already the last key
 *
 * @param history the list of scene keys that the user has visited
 * @param sceneKey the scene key on which the user is currently
 * @returns the updated history
 */
const updateHistory = (history: string[], sceneKey: string) => {
  if (history.at(-1) === sceneKey) return history;
  return [...history, sceneKey];
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
  const [progress, setProgress] = useState(storyProgress);

  const updateStoryProgress = useCallback(
    async (progress: StoryProgress, scene: Scene) => {
      const payload = {
        ...progress,
        currentSceneKey: scene.key,
        lastPlayedAt: new Date(),
        history: updateHistory(progress.history, scene.key),
        ...(isLastScene(scene) && { finished: true }),
      };

      await getLocalRepository().updateStoryProgress(payload);
      setProgress(payload);
    },
    [],
  );

  useEffect(() => {
    if (storyProgress && scene) updateStoryProgress(storyProgress, scene);
  }, [storyProgress, scene, updateStoryProgress]);

  return progress;
};
