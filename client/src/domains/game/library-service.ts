import { Story } from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import {
  getImportService,
  ImportServicePort,
} from "@/services/common/import-service";
import { DexieError } from "dexie";

// TODO: uniformize responses
export const _getLibraryService = ({
  localRepository,
  importService,
}: {
  localRepository: LocalRepositoryPort;
  importService: ImportServicePort;
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
      const parsed = importService.parseJSON(fileContent);
      if (!parsed.isOk) return { error: "Could not parse file content" };

      await localRepository
        .unitOfWork(
          async () => {
            const story = await importService.createStory({
              story: parsed.data,
              type: "imported",
            });

            await importService.createScenes({
              story: parsed.data,
              newStoryKey: story.data.key,
            });

            await _createBlankStoryProgress({ story: story.data });
          },
          {
            entities: ["story-progress", "scene", "story", "user"],
            mode: "readwrite",
          },
        )
        .catch((err) => {
          console.log((err as DexieError).inner, (err as DexieError).stack);
        });

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
    importService: getImportService(),
  });
