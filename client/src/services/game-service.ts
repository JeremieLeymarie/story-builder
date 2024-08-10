import { Action, Scene, Story, StoryProgress } from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";

const _getGameService = ({
  localRepository,
}: {
  localRepository: LocalRepositoryPort;
}) => {
  return {
    saveProgress: async (
      progress: StoryProgress,
      {
        currentSceneKey,
        sceneActions,
      }: { currentSceneKey: string; sceneActions: Action[] },
    ) => {
      const user = await localRepository.getUser();

      if (!user) return null;

      // TODO: test history update && finished
      await localRepository.updateStoryProgress({
        ...progress,
        currentSceneKey,
        history:
          progress.history.at(-1) === currentSceneKey
            ? progress.history
            : [...progress.history, currentSceneKey],
        lastPlayedAt: new Date(),
        ...(!sceneActions.length && { finished: true }),
      });
    },

    getOrCreateStoryProgress: async (story: Story) => {
      const progress = await localRepository.getStoryProgress(story.key);
      if (progress) return progress;

      if (!story.firstSceneKey) {
        throw new Error(
          `Error: story should have a first scene. Story: ${story.key}`,
        );
      }

      const payload = {
        history: [story.firstSceneKey],
        currentSceneKey: story.firstSceneKey,
        lastPlayedAt: new Date(),
      };

      const createdProgress = await localRepository.createStoryProgress({
        storyKey: story.key,
        ...payload,
      });

      return createdProgress;
    },

    getLastGamePlayed: async () => {
      return await localRepository.getLastGamePlayed();
    },

    getSceneData: async (sceneKey: string) => {
      const scene = await localRepository.getScene(sceneKey);
      return scene;
    },

    getFirstSceneData: async (storyKey: string) => {
      const story = await localRepository.getStory(storyKey);

      if (!story) return { story: null };

      const scene = await localRepository.getScene(story.firstSceneKey);

      return { story, scene };
    },

    getStoryProgress: async (storyKey: string) => {
      const storyProgress = await localRepository.getStoryProgress(storyKey);
      return storyProgress;
    },

    loadGamesState: async ({
      progresses,
      libraryStories,
    }: {
      progresses: StoryProgress[];
      libraryStories: { stories: Story[]; scenes: Scene[] };
    }) => {
      await localRepository.unitOfWork(
        async () => {
          await localRepository.updateOrCreateStoryProgresses(progresses);
          await localRepository.updateOrCreateStories(libraryStories.stories);
          await localRepository.updateOrCreateScenes(libraryStories.scenes);
        },
        { mode: "readwrite", entities: ["story", "scene", "story-progress"] },
      );
    },

    getStoryProgresses: async () => {
      const progresses = await localRepository.getStoryProgresses();

      return progresses;
    },
  };
};

export const getGameService = () =>
  _getGameService({
    localRepository: getLocalRepository(),
  });