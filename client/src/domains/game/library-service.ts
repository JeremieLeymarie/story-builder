import {
  CharacterConfiguration,
  ProgressCharacter,
  Scene,
  Story,
  StoryProgress,
} from "@/lib/storage/domain";
import { getLocalRepository, LocalRepositoryPort } from "@/repositories";
import {
  getJsonService,
  ImportExportServicePort,
  TEMPORARY_NULL_KEY,
} from "@/services/common/json-service";
import { JsonStoryData } from "@/services/common/schema";
import { GameRepositoryPort, getDexieGameRepository } from "./game-repository";
import {
  CharacterRepositoryPort,
  getDexieCharacterRepository,
} from "./character-repository";

// TODO: uniformize responses
export const _getLibraryService = ({
  localRepository,
  jsonService,
  gameRepository,
  characterRepository,
}: {
  localRepository: LocalRepositoryPort;
  jsonService: ImportExportServicePort;
  gameRepository: GameRepositoryPort;
  characterRepository: CharacterRepositoryPort;
}) => {
  const _createInitialCharacter = (characterConfig: CharacterConfiguration) => {
    return {
      attributes: Object.fromEntries(
        Object.values(characterConfig.attributes).map(
          ({ key, type, name, description, visibility, initialValue }) => [
            key,
            {
              key,
              type,
              name,
              description,
              visibility,
              initialValue,
              value: initialValue,
            },
          ],
        ),
      ),
    } satisfies ProgressCharacter;
  };

  const _createBlankStoryProgress = async ({
    storyKey,
    name,
  }: {
    storyKey: string;
    name?: string;
  }) => {
    const user = await localRepository.getUser();
    const story = await localRepository.getStory(storyKey);
    const characterConfig = await characterRepository.getConfig(storyKey);

    if (!story) throw new Error(`Error: invalid story key: ${storyKey}`);

    if (!story.firstSceneKey || story.firstSceneKey === TEMPORARY_NULL_KEY) {
      throw new Error(
        `Error: story should have a first scene. Story: ${story.key}`,
      );
    }

    const progress = await localRepository.createStoryProgress({
      storyKey: story.key,
      history: [],
      currentSceneKey: story.firstSceneKey,
      lastPlayedAt: new Date(),
      createdAt: new Date(),
      totalPlayTimeMs: 0,
      userKey: user?.key ?? undefined,
      ...(name ? { name } : {}),
      ...(characterConfig
        ? { character: _createInitialCharacter(characterConfig) }
        : {}),
    });

    return progress;
  };

  const _getLibrary = async () => {
    const user = await localRepository.getUser();
    // Retrieving all the storyProgresses of the current user in the database
    const storyProgresses = await localRepository.getUserStoryProgresses(
      user?.key,
    );

    // Store most recent story progress for each story
    const mostRecentStoryProgressByStory: Record<string, StoryProgress> = {};

    storyProgresses.forEach((storyProgress) => {
      const storyKey = storyProgress.storyKey;
      const storyHasStoryProgress = storyKey in mostRecentStoryProgressByStory;
      const shouldReplaceStoryProgress =
        storyHasStoryProgress &&
        storyProgress.lastPlayedAt >
          mostRecentStoryProgressByStory[storyKey]!.lastPlayedAt;

      if (!storyHasStoryProgress || shouldReplaceStoryProgress) {
        mostRecentStoryProgressByStory[storyKey] = storyProgress;
      }
    });

    // Sort story keys by last played save
    const sortedStoryKeys = Object.values(mostRecentStoryProgressByStory)
      .sort((a, b) => {
        return b.lastPlayedAt.getTime() - a.lastPlayedAt.getTime();
      })
      .map((storyProgress) => storyProgress.storyKey);

    // Fetch all the stories associated with the sorted story keys
    const stories = await localRepository.getStoriesByKeys(sortedStoryKeys);

    // Sorting the story in descending order in the library from most recent to the least recent.
    const sortedStories = stories.sort((a, b) => {
      return sortedStoryKeys.indexOf(a.key) - sortedStoryKeys.indexOf(b.key);
    });

    const finishedGameKeys = await localRepository.getFinishedGameKeys();

    return {
      games: sortedStories,
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
    importStory: async (importData: JsonStoryData) => {
      await localRepository.unitOfWork(
        async () => {
          const story = await jsonService.createStory({
            story: importData,
            type: "imported",
          });

          let oldCharacterAttrToNew: Record<string, string> = {};
          if (importData.characterConfig)
            oldCharacterAttrToNew = await jsonService.createCharacterConfig({
              newStoryKey: story.data.key,
              characterConfig: importData.characterConfig,
            });

          const oldScenesToNew = await jsonService.createScenes({
            story: importData,
            newStoryKey: story.data.key,
            oldCharacterAttrToNew,
          });

          if (importData.theme)
            await jsonService.createTheme({
              newStoryKey: story.data.key,
              theme: importData.theme,
            });

          if (importData.wiki)
            await jsonService.createWiki({
              oldScenesToNew,
              type: "imported",
              wikiData: importData.wiki,
              newStoryKey: story.data.key,
            });

          await _createBlankStoryProgress({ storyKey: story.data.key });
        },
        {
          entities: [
            "story-progress",
            "scene",
            "story",
            "story-theme",
            "character-configuration",
            "user",
            "wiki",
            "wiki-article",
            "wiki-article-link",
            "wiki-category",
          ],
          mode: "readwrite",
        },
      );

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

      // The first element in the library is now the last playedAt game
      const [currentProgress, ...otherProgresses] = progressesWithLastScene;

      return {
        story,
        currentProgress: currentProgress ?? null,
        otherProgresses,
      };
    },

    createBlankStoryProgress: _createBlankStoryProgress,

    renameStoryProgress: async (progress: StoryProgress, name: string) => {
      return localRepository.updateStoryProgress({ ...progress, name });
    },

    deleteGame: async (storyKey: string) => {
      await localRepository.unitOfWork(
        async () => {
          const scenesKeys = (
            await localRepository.getScenesByStoryKey(storyKey)
          ).map(({ key }) => key);
          const storyProgressKeys = (
            await localRepository.getStoryProgresses(storyKey)
          ).map((p) => p.key);

          await gameRepository.deleteWiki(storyKey);
          await localRepository.deleteStoryProgresses(storyProgressKeys);
          await localRepository.deleteScenes(scenesKeys);
          await localRepository.deleteStory(storyKey);
        },
        {
          mode: "readwrite",
          entities: [
            "scene",
            "story",
            "story-progress",
            "wiki",
            "wiki-category",
            "wiki-article",
            "wiki-article-link",
          ],
        },
      );
    },

    deleteStoryProgress: async (progressKey: string) => {
      await localRepository.deleteStoryProgresses([progressKey]);
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
    jsonService: getJsonService(),
    gameRepository: getDexieGameRepository(),
    characterRepository: getDexieCharacterRepository(),
  });
