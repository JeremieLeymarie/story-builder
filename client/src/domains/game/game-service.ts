import {
  Action,
  Scene,
  SideEffect,
  Story,
  StoryProgress,
} from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import { match } from "ts-pattern";
import { produce } from "immer";
import {
  getDexieProgressRepository,
  ProgressRepositoryPort,
} from "./progress-repository";

type GameServicePort = {
  saveProgress: (
    storyProgressKey: string,
    currentScene: Scene,
  ) => Promise<{
    updatedProgress: StoryProgress | null;
    effectsTriggered: SideEffect[];
  }>;
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
  progressRepo,
}: {
  localRepository: LocalRepositoryPort;
  progressRepo: ProgressRepositoryPort;
}): GameServicePort => {
  const getStoryProgresses = async () => {
    const user = await localRepository.getUser();
    const progresses = await localRepository.getUserStoryProgresses(user?.key);

    return progresses;
  };

  const _triggerSideEffects = async ({
    scene,
    progress,
  }: {
    scene: Scene;
    progress: StoryProgress;
  }) => {
    if ((scene.sideEffects ?? []).length <= 0)
      return { updatedCharacter: null, effectsTriggered: [] };

    const effectsTriggered: SideEffect[] = [];
    console.log(progress);
    if (!progress.character)
      throw new Error(`Character does not exist on progress ${progress.key}`);

    const updatedCharacter =
      produce(progress.character, (character) => {
        scene.sideEffects!.forEach((effectConfig) => {
          const attribute =
            character.attributes[effectConfig.effect.attributeKey];

          if (!attribute)
            throw new Error(
              `Attribute ${effectConfig.effect.attributeKey} does not exist on progress ${progress.key}`,
            );

          attribute.value += effectConfig.effect.increment;
          effectsTriggered.push(effectConfig);
        });
      }) ?? null;

    return { updatedCharacter, effectsTriggered };
  };

  return {
    saveProgress: async (storyProgressKey, currentScene) => {
      const user = await localRepository.getUser();
      const progress = await progressRepo.get(storyProgressKey);

      if (!progress)
        throw new Error(`No progress found for story ${storyProgressKey}`);

      const isImmediateDuplicate = progress.history.at(-1) === currentScene.key;

      let updatePayload: Partial<StoryProgress> = {};
      const effectsTriggered: SideEffect[] = [];
      console.log({ isImmediateDuplicate });

      if (isImmediateDuplicate) {
        updatePayload = { userKey: user?.key, lastPlayedAt: new Date() };
      } else {
        const newHistory = [...progress.history, currentScene.key];

        const effectsResult = await _triggerSideEffects({
          scene: currentScene,
          progress,
        });

        updatePayload = {
          currentSceneKey: currentScene.key,
          history: newHistory,
          lastPlayedAt: new Date(),
          userKey: user?.key,
          ...(!currentScene.actions.length && { finished: true }),
          ...(effectsResult.updatedCharacter && {
            character: effectsResult.updatedCharacter,
          }),
        };
        effectsTriggered.push(...effectsResult.effectsTriggered);
      }

      await progressRepo.update(progress.key, updatePayload);

      return {
        updatedProgress: { ...progress, ...updatePayload },
        effectsTriggered,
      };
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
      return await progressRepo.get(storyKey);
    },

    getStoryProgresses,
  };
};

export const getGameService = () =>
  _getGameService({
    localRepository: getLocalRepository(),
    progressRepo: getDexieProgressRepository(),
  });
