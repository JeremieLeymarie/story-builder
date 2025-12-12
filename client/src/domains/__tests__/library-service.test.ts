import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BASIC_SCENE,
  BASIC_STORY,
  BASIC_STORY_PROGRESS,
  BASIC_USER,
} from "@/repositories/stubs/data";
import dayjs from "dayjs";
import { _getLibraryService } from "../game/library-service";
import {
  MockImportService,
  getImportServiceStub,
} from "@/services/common/stubs/stub-import-service";
import {
  MOCK_IMPORTED_SCENE,
  MOCK_IMPORTED_STORY,
} from "./data/imported-story-mocks";
import { getTestFactory } from "@/lib/testing/factory";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";

const factory = getTestFactory();

describe("library-service", () => {
  let libraryService: ReturnType<typeof _getLibraryService>;
  let localRepository: MockLocalRepository;
  let importService: MockImportService;

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    importService = getImportServiceStub();

    libraryService = _getLibraryService({
      localRepository,
      importService,
    });

    vi.useFakeTimers();
  });

  describe("importFromJSON", () => {
    it("should import story from JSON", async () => {
      const result = await libraryService.importStory({
        story: MOCK_IMPORTED_STORY,
        scenes: [MOCK_IMPORTED_SCENE],
      });
      expect(result).toStrictEqual({ error: null });
    });
  });

  describe("getLibrary", () => {
    it("should get all library data, sorted by last played save", async () => {
      const storyProgressA = factory.storyProgress({
        key: "key-1",
        storyKey: "story-key-1",
        lastPlayedAt: new Date("2025/05/01"),
      });
      const storyProgressB = factory.storyProgress({
        key: "key-2",
        storyKey: "story-key-2",
        lastPlayedAt: new Date("2025/06/01"),
      });
      const storyProgressC = factory.storyProgress({
        key: "key-3",
        storyKey: "story-key-2",
        lastPlayedAt: new Date("2025/01/01"),
      });
      localRepository.getUserStoryProgresses = vi.fn(() => {
        return Promise.resolve([
          storyProgressA,
          storyProgressB,
          storyProgressC,
        ]);
      });

      // Story creation dates shouldn't be taken into account when getting sorted library data
      const storyA = factory.story.library({
        key: "story-key-1",
        creationDate: new Date("2025/10/01"),
      });
      const storyB = factory.story.library({
        key: "story-key-2",
        creationDate: new Date("2025/01/01"),
      });
      localRepository.getStoriesByKeys = vi.fn(() => {
        return Promise.resolve([storyA, storyB]);
      });

      const data = await libraryService.getLibrary();

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getUserStoryProgresses).toHaveBeenCalledWith(
        BASIC_USER.key,
      );

      // Vitest doesn't allow to check parameters without checking order, so this is the only way I found to do it
      const args = localRepository.getStoriesByKeys.mock.calls[0];
      const sortedArgs = args?.[0].sort();
      expect(sortedArgs).toStrictEqual(["story-key-1", "story-key-2"]);

      expect(localRepository.getFinishedGameKeys).toHaveBeenCalled();

      expect(data).toStrictEqual({
        games: [storyB, storyA],
        finishedGameKeys: ["key"],
      });
    });
  });

  describe("getGameDetail", () => {
    const CURRENT = {
      key: "most-recent",
      storyKey: "ding",
      userKey: "pipou",
      history: ["most-recent-vroum"],
      currentSceneKey: "most-recent-vroum",
      lastPlayedAt: dayjs(new Date()).add(10, "days").toDate(),
    };

    const OTHER = {
      key: "older",
      storyKey: "ding",
      userKey: "pipou",
      history: ["older-vroum"],
      currentSceneKey: "older-vroum",
      lastPlayedAt: new Date(),
    };

    const FINISHED = {
      key: "finished",
      storyKey: "ding",
      userKey: "pipou",
      history: ["finished-vroum"],
      currentSceneKey: "finished-vroum",
      lastPlayedAt: new Date(),
      finished: true,
    };

    const CURRENT_SCENE = {
      key: "most-recent-vroum",
      actions: [
        { type: "simple" as const, targets: [], text: "action A" },
        { type: "simple" as const, targets: [], text: "action B" },
      ],
      builderParams: { position: { x: 0, y: 0 } },
      content: makeSimpleLexicalContent("pas content"),
      storyKey: "zut",
      title: "flûte",
    };

    const OTHER_SCENE = {
      key: "older-vroum",
      actions: [
        { type: "simple" as const, targets: [], text: "action A" },
        { type: "simple" as const, targets: [], text: "action B" },
      ],
      builderParams: { position: { x: 0, y: 0 } },
      content: makeSimpleLexicalContent("pas content"),
      storyKey: "zut",
      title: "flûte",
    };
    const FINISHED_SCENE = {
      key: "finished-vroum",
      actions: [
        { type: "simple" as const, targets: [], text: "action A" },
        { type: "simple" as const, targets: [], text: "action B" },
      ],
      builderParams: { position: { x: 0, y: 0 } },
      content: makeSimpleLexicalContent("pas content"),
      storyKey: "zut",
      title: "flûte",
    };

    const STORY = {
      key: "ding",
      title: "Tidididoudoum tidididoudoum",
      description: "Sacré histoire...",
      image: "http://ton-image.fr",
      type: "builder" as const,
      firstSceneKey: "zut",
      genres: ["adventure" as const, "children" as const],
      creationDate: new Date(),
    };

    beforeEach(() => {
      localRepository.getScenes.mockResolvedValueOnce([
        CURRENT_SCENE,
        OTHER_SCENE,
        FINISHED_SCENE,
      ]);

      localRepository.getStoryProgressesOrderedByDate.mockResolvedValueOnce([
        CURRENT,
        OTHER,
        FINISHED,
      ]);

      localRepository.getStory.mockResolvedValueOnce(STORY);
    });

    it("should retrieve details about a story", async () => {
      const data = await libraryService.getGameDetail("ding");

      expect(localRepository.getStory).toHaveBeenCalledWith("ding");
      expect(
        localRepository.getStoryProgressesOrderedByDate,
      ).toHaveBeenCalledWith(BASIC_USER.key, "ding");
      expect(localRepository.getScenes).toHaveBeenCalledWith([
        "most-recent-vroum",
        "older-vroum",
        "finished-vroum",
      ]);

      expect(data).toStrictEqual({
        story: STORY,
        currentProgress: { ...CURRENT, lastScene: CURRENT_SCENE },
        otherProgresses: [
          { ...OTHER, lastScene: OTHER_SCENE },
          { ...FINISHED, lastScene: FINISHED_SCENE },
        ],
      });
    });
  });

  describe("createBlankStoryProgress", () => {
    it("should create a story progress in the local database", async () => {
      localRepository.getStoryProgress.mockResolvedValueOnce(null);

      const createdProgress = await libraryService.createBlankStoryProgress({
        storyKey: BASIC_STORY.key,
      });

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.createStoryProgress).toHaveBeenCalledWith({
        history: [BASIC_STORY.firstSceneKey],
        currentSceneKey: BASIC_STORY.firstSceneKey,
        lastPlayedAt: new Date(),
        userKey: BASIC_USER.key,
        storyKey: BASIC_STORY.key,
      });

      expect(createdProgress).toStrictEqual(BASIC_STORY_PROGRESS);
    });
  });

  describe("deleteGame", () => {
    it("should delete the story", async () => {
      localRepository.getScenesByStoryKey.mockResolvedValueOnce([
        { ...BASIC_SCENE, key: "pshit" },
        { ...BASIC_SCENE, key: "zioum" },
      ]);

      await libraryService.deleteGame("tutu");

      expect(localRepository.deleteStory).toHaveBeenCalledWith("tutu");
      expect(localRepository.deleteScenes).toHaveBeenCalledWith([
        "pshit",
        "zioum",
      ]);
      expect(localRepository.deleteStory).toHaveBeenCalledOnce();
      expect(localRepository.deleteScenes).toHaveBeenCalledOnce();
    });
  });

  describe("loadLibraryState", () => {
    it("should load state in the local database", async () => {
      await libraryService.loadLibraryState({
        progresses: [BASIC_STORY_PROGRESS],
        libraryStories: { stories: [BASIC_STORY], scenes: [BASIC_SCENE] },
      });

      expect(localRepository.unitOfWork).toHaveBeenCalled();
      expect(
        localRepository.updateOrCreateStoryProgresses,
      ).toHaveBeenCalledWith([BASIC_STORY_PROGRESS]);
      expect(localRepository.updateOrCreateStories).toHaveBeenCalledWith([
        BASIC_STORY,
      ]);
      expect(localRepository.updateOrCreateScenes).toHaveBeenCalledWith([
        BASIC_SCENE,
      ]);
    });
  });
});
