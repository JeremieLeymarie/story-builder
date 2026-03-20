import { Action, Scene, Story, StoryProgress } from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import { match } from "ts-pattern";

type GameServicePort = {
  saveProgress: (
    storyProgressKey: string,
    params: {
      currentSceneKey: string;
      sceneActions: Action[];
    },
  ) => Promise<StoryProgress | null>;
  getNextKey: (
    options: {
      sceneKey: string;
      probability: number;
    }[],
  ) => string;
  /**
   * Compute whether or not an action is visible based on progress in the story and action configuration.
   */
  getActionVisibility: (options: {
    action: Action;
    progress: StoryProgress | null;
  }) => boolean;

  getLastGamePlayed: () => Promise<Story | null>;
  getSceneData: (sceneKey: string) => Promise<Scene | null>;
  getFirstSceneData: (storyKey: string) => Promise<
    | {
        story: null;
        scene: null;
      }
    | {
        story: Story;
        scene: Scene | null;
      }
  >;

  getStoryProgress: (storyKey: string) => Promise<StoryProgress | null>;
  getStoryProgresses: () => Promise<StoryProgress[]>;
};

export const _getGameService = ({
  localRepository,
}: {
  localRepository: LocalRepositoryPort;
}): GameServicePort => {
  const getStoryProgresses = async () => {
    const user = await localRepository.getUser();
    const progresses = await localRepository.getUserStoryProgresses(user?.key);

    return progresses;
  };

  return {
    saveProgress: async (
      storyProgressKey,
      { currentSceneKey, sceneActions },
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

    getNextKey: (options) => {
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

    getActionVisibility: ({ action, progress }) => {
      if (action.type === "simple") return true;
      if (!progress) return false;

      return match(action.condition)
        .with({ type: "user-did-visit" }, (condition) =>
          progress.history.includes(condition.sceneKey),
        )
        .with(
          { type: "user-did-not-visit" },
          (condition) => !progress.history.includes(condition.sceneKey),
        )
        .with({ type: "character-attribute" }, (condition) => {
          const attribute =
            progress.character?.attributes[condition.attributeKey];

          // This case shouldn't never happen, but we don't want to block the story if it does
          // Maybe this could issue an error in test mode?
          if (!attribute) return true;

          return match(condition.comparator)
            .with("lower-than", () => attribute.value < condition.value)
            .with("greater-than", () => attribute.value > condition.value)
            .exhaustive();
        })
        .exhaustive();
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

    getSceneData: async (sceneKey) => {
      return await localRepository.getScene(sceneKey);
    },

    getFirstSceneData: async (storyKey) => {
      const story = await localRepository.getStory(storyKey);
      if (!story) return { story: null, scene: null };
      const scene = await localRepository.getScene(story.firstSceneKey);
      return { story, scene };
    },

    getStoryProgress: async (storyKey) => {
      return await localRepository.getStoryProgress(storyKey);
    },

    getStoryProgresses,
  };
};

export const getGameService = () =>
  _getGameService({
    localRepository: getLocalRepository(),
  });
