import { Scene, Story } from "@/lib/storage/domain";
import {
  getLocalRepository,
  getRemoteAPIRepository,
  LocalRepositoryPort,
  RemoteRepositoryPort,
} from "@/repositories";
import { fullStorySchema } from "./common/schemas";
import { isOnline } from "./common/sync";

// TODO: uniformize responses
// TODO: test all of this
export const _getLibraryService = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}) => {
  const _addToLibrary = async ({ story }: { story: Story }) => {
    const user = await localRepository.getUser();

    await localRepository.createStoryProgress({
      history: [story.firstSceneKey],
      currentSceneKey: story.firstSceneKey,
      lastPlayedAt: new Date(),
      storyKey: story.key,
      userKey: user?.key ?? undefined,
    });
  };

  return {
    downloadStory: async (storyKey: string) => {
      // TODO: what happens if story already exists (from other user for example)
      if (!isOnline()) return false;
      const { data } = await remoteRepository.downloadStory(storyKey);

      if (data) {
        const story = await localRepository.getStory(data.story.key);

        if (!story) {
          await localRepository.createStory(data.story);
          await localRepository.createScenes(data.scenes);
        }

        await _addToLibrary({ story: data.story });

        return true;
      }

      return false;
    },

    importFromJSON: async (fileContent: string) => {
      // TODO: what happens if story already exists (from other user for example)
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

      const story = await localRepository.createStory({
        ...importedStory,
        status: "imported",
        originalStoryKey: importedStoryKey,
      });

      if (!story) {
        return { error: "Could not create story" };
      }

      const oldScenesToNewScenes: Record<string, string> = {};

      // This could be a performance issue
      for (const scene of zodParsed.data.scenes) {
        const { key: oldSceneKey, ...sceneData } = scene;
        const { key } = await localRepository.createScene({
          ...sceneData,
          storyKey: story?.key,
          actions: [],
        });
        oldScenesToNewScenes[oldSceneKey] = key;
      }

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

      await _addToLibrary({ story });

      return { error: null };
    },

    getLibrary: async () => {
      const user = await localRepository.getUser();
      const storyKeys = (
        await localRepository.getStoryProgresses(user?.key)
      ).map(({ storyKey }) => storyKey);

      const games = await localRepository.getStoriesByKeys(storyKeys);

      const finishedGameKeys = await localRepository.getFinishedGameKeys();

      return {
        games,
        finishedGameKeys,
      };
    },

    getLibraryDetail: async (storyKey: string) => {
      const story = await localRepository.getStory(storyKey);
      const progress = await localRepository.getStoryProgress(storyKey);

      if (!progress) {
        return { story, progress, lastScene: null };
      }

      const lastScene = await localRepository.getScene(
        progress?.currentSceneKey,
      );

      return { story, progress, lastScene };
    },
  };
};

export const getLibraryService = () =>
  _getLibraryService({
    localRepository: getLocalRepository(),
    remoteRepository: getRemoteAPIRepository(),
  });
