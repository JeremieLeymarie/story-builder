import { Action } from "@/lib/storage/domain";
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
      storyProgressKey: string,
      {
        currentSceneKey,
        sceneActions,
      }: {
        currentSceneKey: string;
        sceneActions: Action[];
      },
    ) => {
      const user = await localRepository.getUser();
      const progress = await localRepository.getStoryProgress(storyProgressKey);

      if (!progress)
        throw new Error(`No progress found for story ${storyProgressKey}`);

      const isImmediateDuplicate = progress.history.at(-1) === currentSceneKey;
      const newHistory = isImmediateDuplicate
        ? progress.history
        : [...progress.history, currentSceneKey];

      const updatedProgress = await localRepository.updateStoryProgress({
        ...progress,
        currentSceneKey,
        history: newHistory,
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
    getNextKey: (options: { sceneKey: string; probability: number }[]) => {
      if (options.length === 0) throw new Error("options must not be empty");
      const total = options.reduce((sum, opt) => sum + opt.probability, 0);
      const rand = Math.random() * total;
      let cumulative = 0;
      for (const opt of options) {
        cumulative += opt.probability;
        if (rand <= cumulative) {
          return opt.sceneKey;
        }
      }

      return options[options.length - 1]!.sceneKey;
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
