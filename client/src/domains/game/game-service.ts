import { Action, StoryProgress } from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";

export const _getGameService = ({
  localRepository,
}: {
  localRepository: LocalRepositoryPort;
}) => {
  const getStoryProgresses = async () => {
    const user = await localRepository.getUser();
    const progresses = await localRepository.getUserStoryProgresses(user?.key);

    return progresses;
  };

  return {
    saveProgress: async (
      progress: StoryProgress,
      {
        currentSceneKey,
        sceneActions,
      }: { currentSceneKey: string; sceneActions: Action[] },
    ) => {
      const user = await localRepository.getUser();
      const scene = await localRepository.getScene(currentSceneKey);

      if (!scene) return null;

      // TODO: test history update && finished
      const updatedProgress = await localRepository.updateStoryProgress({
        ...progress,
        currentSceneKey,
        history:
          progress.history.at(-1) === currentSceneKey
            ? progress.history
            : [...progress.history, currentSceneKey],
        lastPlayedAt: new Date(),
        ...(!sceneActions.length && { finished: true }),
        userKey: user?.key,
      });

      return updatedProgress;
    },

    getLastGamePlayed: async () => {
      const user = await localRepository.getUser();
      const progress = await localRepository.getMostRecentStoryProgress(
        user?.key,
      );

      if (!progress) return null;

      const story = await localRepository.getStory(progress.storyKey);

      return story;
    },

    getSceneData: async (sceneKey: string) => {
      return await localRepository.getScene(sceneKey);
    },

    getFirstSceneData: async (storyKey: string) => {
      const story = await localRepository.getStory(storyKey);

      if (!story) return { story: null, scene: null };

      const scene = await localRepository.getScene(story.firstSceneKey);

      return { story, scene };
    },

    getStoryProgress: async (storyKey: string) => {
      return await localRepository.getStoryProgress(storyKey);
    },

    getStoryProgresses,
  };
};

export const getGameService = () =>
  _getGameService({
    localRepository: getLocalRepository(),
  });
