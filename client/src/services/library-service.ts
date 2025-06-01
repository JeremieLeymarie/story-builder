import { Scene, Story } from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import { fullStorySchema } from "./common/schemas";

// TODO: uniformize responses
// TODO: test all of this
export const _getLibraryService = ({
  localRepository,
}: {
  localRepository: LocalRepositoryPort;
}) => {
  const _createBlankStoryProgress = async ({ story }: { story: Story }) => {
    const user = await localRepository.getUser();

    if (!story.firstSceneKey) {
      throw new Error(
        `Error: story should have a first scene. Story: ${story.key}`,
      );
    }

    const progress = await localRepository.createStoryProgress({
      storyKey: story.key,
      history: [story.firstSceneKey],
      currentSceneKey: story.firstSceneKey,
      lastPlayedAt: new Date(),
      userKey: user?.key ?? undefined,
    });

    return progress;
  };

  const _getLibrary = async () => {
    const user = await localRepository.getUser();
    const storyKeys = (
      await localRepository.getUserStoryProgresses(user?.key)
    ).map(({ storyKey }) => storyKey);

    const games = await localRepository.getStoriesByKeys(storyKeys);

    const finishedGameKeys = await localRepository.getFinishedGameKeys();

    return {
      games,
      finishedGameKeys,
    };
  };

  return {
    importFromJSON: async (fileContent: string) => {
      let parsed: unknown;

      try {
        parsed = JSON.parse(fileContent);
      } catch (_) {
        return { error: "Invalid JSON format" };
      }
      const zodParsed = fullStorySchema.safeParse(parsed);
      if (!zodParsed.success)
        return {
          error: zodParsed.error.issues[0]?.message || "Invalid format",
        };

      const scenesByKey = zodParsed.data.scenes.reduce(
        (acc, scene) => ({
          ...acc,
          [scene.key]: scene,
        }),
        {} as Record<string, Scene>,
      );

      const { key: importedStoryKey, ...importedStory } = zodParsed.data.story;

      // Create story
      const story = await localRepository.createStory({
        ...importedStory,
        type: "imported",
        originalStoryKey: importedStoryKey,
      });

      if (!story) {
        return { error: "Could not create story" };
      }

      const oldScenesToNewScenes: Record<string, string> = {};

      // This could be a performance issue
      // Create scenes without actions
      for (const scene of zodParsed.data.scenes) {
        const { key: oldSceneKey, ...sceneData } = scene;
        const { key } = await localRepository.createScene({
          ...sceneData,
          storyKey: story?.key,
          actions: [],
        });
        oldScenesToNewScenes[oldSceneKey] = key;
      }

      // Update scenes
      await localRepository.updateScenes(
        zodParsed.data.scenes
          .map((scene) => {
            const actions = scenesByKey[scene.key]?.actions;

            if (!actions) {
              return null;
            }

            const newActions = actions?.map((action) => ({
              ...action,
              sceneKey: action.sceneKey
                ? oldScenesToNewScenes[action.sceneKey]
                : undefined,
            }));

            const newSceneKey = oldScenesToNewScenes[scene.key];

            if (!newSceneKey) {
              return null;
            }

            return { key: newSceneKey, actions: newActions };
          })
          .filter((scene) => !!scene),
      );

      await _createBlankStoryProgress({ story });

      return { error: null };
    },

    getLibrary: _getLibrary,

    getAllLibraryData: async () => {
      const { games: stories } = await _getLibrary();

      const scenes = await localRepository.getScenesByStoryKey(
        stories?.map((story) => story.key) ?? [],
      );

      return { stories, scenes };
    },

    getGameDetail: async (storyKey: string) => {
      const story = await localRepository.getStory(storyKey);
      const user = await localRepository.getUser();

      const progresses = await localRepository.getStoryProgressesOrderedByDate(
        user?.key,
        storyKey,
      );

      // Get more data about the last scene of every story progress (scene title, etc...)
      const lastSceneKeys = progresses.map((p) => p.currentSceneKey);

      const lastScenes = await localRepository.getScenes(lastSceneKeys);

      const progressesWithLastScene = progresses.map((p) => ({
        ...p,
        lastScene: lastScenes.find((scene) => scene.key === p.currentSceneKey),
      }));

      // The first element in the orderered progresses represent the last played game
      const [currentProgress, ...otherProgresses] = progressesWithLastScene;

      return {
        story,
        currentProgress: currentProgress ?? null,
        otherProgresses,
      };
    },

    createBlankStoryProgress: _createBlankStoryProgress,

    deleteGame: async (storyKey: string) => {
      const scenesKeys = (
        await localRepository.getScenesByStoryKey(storyKey)
      ).map(({ key }) => key);

      await localRepository.unitOfWork(
        async () => {
          await localRepository.deleteScenes(scenesKeys);
          await localRepository.deleteStory(storyKey);
        },
        {
          mode: "readwrite",
          entities: ["scene", "story"],
        },
      );
    },
  };
};

export const getLibraryService = () =>
  _getLibraryService({
    localRepository: getLocalRepository(),
  });
