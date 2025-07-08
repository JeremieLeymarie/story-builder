import { Scene, Story, StoryProgress } from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import {
  getImportService,
  ImportServicePort,
  StoryFromImport,
  TEMPORARY_NULL_KEY,
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
  const _createBlankStoryProgress = async ({
    storyKey,
  }: {
    storyKey: string;
  }) => {
    const user = await localRepository.getUser();
    const story = await localRepository.getStory(storyKey);

    if (!story) throw new Error(`Error: invalid story key: ${storyKey}`);

    if (!story.firstSceneKey || story.firstSceneKey === TEMPORARY_NULL_KEY) {
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

     // 1. Retrieve all storyProgresses linked to the user => DB 
      const storyProgresses = await localRepository.getUserStoryProgresses(user?.key);

      // 2. For each storyKey in your story progresses, keep only the most recent storyProgresses, so that you have a list of storyProgresses with unique storyKeys => Logic
      const storyProgressByStoryKey: Record<string, StoryProgress> = {}

      storyProgresses.forEach((storyProgress) => {
        const storyKey = storyProgress.storyKey
        const storyHasStoryProgress = storyKey in storyProgressByStoryKey
        const shouldReplaceStoryProgress = storyHasStoryProgress && storyProgress.lastPlayedAt > storyProgressByStoryKey[storyKey]!.lastPlayedAt

        if (!storyHasStoryProgress || shouldReplaceStoryProgress) {
          storyProgressByStoryKey[storyKey] = storyProgress
        }
      })

      // 3. Sort the list of storyProgresses by lastPlayedAt => Logic
      const sortedStoryKeys = Object.values(storyProgressByStoryKey).sort((a, b) => {
        return b.lastPlayedAt.getTime() -  a.lastPlayedAt.getTime()
      }).map(storyProgress => storyProgress.storyKey)

      // 4. Retrieve all the stories linked to the list of storyProgresses computed just before => DB
      const stories = await localRepository.getStoriesByKeys(sortedStoryKeys)

      // 5. Sort the stories you retrieved to match the order of the sorted storyProgresses => Logic
      const sortedStories = stories.sort((a, b) => {
        return sortedStoryKeys.indexOf(a.key) - sortedStoryKeys.indexOf((b.key))
      })

      const finishedGameKeys = await localRepository.getFinishedGameKeys();
      
      return {
        games : sortedStories,
        finishedGameKeys,
      };
  };

  const _getAllLibraryData = async () => {
    const { games: stories } = await _getLibrary();

    const scenes = await localRepository.getScenesByStoryKey(
      stories?.map((story) => story.key) ?? [],
    );

    return { stories, scenes };
  };

  return {
    importStory: async (storyFromImport: StoryFromImport) => {
      await localRepository
        .unitOfWork(
          async () => {
            const story = await importService.createStory({
              story: storyFromImport,
              type: "imported",
            });

            await importService.createScenes({
              story: storyFromImport,
              newStoryKey: story.data.key,
            });

            await _createBlankStoryProgress({ storyKey: story.data.key });
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

    getAllLibraryData: _getAllLibraryData,

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

    loadLibraryState: async ({
      progresses,
      libraryStories,
    }: {
      progresses: StoryProgress[];
      libraryStories: { stories: Story[]; scenes: Scene[] };
    }) => {
      const newScenesKeys = libraryStories.scenes.map((s) => s.key);
      const newStoriesKeys = libraryStories.stories.map((s) => s.key);
      const newProgressesKeys = progresses.map((p) => p.key);

      await localRepository.unitOfWork(
        async () => {
          const user = await localRepository.getUser();
          const existingProgresses =
            await localRepository.getUserStoryProgresses(user?.key);
          const currentLibraryState = await _getAllLibraryData();

          await localRepository.deleteScenes(
            currentLibraryState.scenes
              .filter((s) => !newScenesKeys.includes(s.key))
              .map((s) => s.key),
          );
          await localRepository.deleteStories(
            currentLibraryState.stories
              .filter((s) => !newStoriesKeys.includes(s.key))
              .map((s) => s.key),
          );
          await localRepository.deleteStoryProgresses(
            existingProgresses
              .filter((p) => !newProgressesKeys.includes(p.key))
              .map((p) => p.key),
          );
          await localRepository.updateOrCreateStoryProgresses(progresses);
          await localRepository.updateOrCreateStories(libraryStories.stories);
          await localRepository.updateOrCreateScenes(libraryStories.scenes);
        },
        {
          mode: "readwrite",
          entities: ["story", "scene", "story-progress", "user"],
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
