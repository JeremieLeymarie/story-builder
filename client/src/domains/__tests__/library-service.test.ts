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
    it("should get all library data", async () => {
      const data = await libraryService.getLibrary();

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getUserStoryProgresses).toHaveBeenCalledWith(
        BASIC_USER.key,
      );
      expect(localRepository.getStoriesByKeys).toHaveBeenCalledWith([
        BASIC_STORY_PROGRESS.storyKey,
      ]);
      expect(localRepository.getFinishedGameKeys).toHaveBeenCalled();

      expect(data).toStrictEqual({
        games: [BASIC_STORY],
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
      actions: [{ text: "action A" }, { text: "action B" }],
      builderParams: { position: { x: 0, y: 0 } },
      content: "pas content",
      storyKey: "zut",
      title: "flûte",
    };

    const OTHER_SCENE = {
      key: "older-vroum",
      actions: [{ text: "action A" }, { text: "action B" }],
      builderParams: { position: { x: 0, y: 0 } },
      content: "pas content",
      storyKey: "zut",
      title: "flûte",
    };
    const FINISHED_SCENE = {
      key: "finished-vroum",
      actions: [{ text: "action A" }, { text: "action B" }],
      builderParams: { position: { x: 0, y: 0 } },
      content: "pas content",
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
        story: BASIC_STORY,
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
});
