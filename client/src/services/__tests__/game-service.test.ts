import { LocalRepositoryPort } from "@/repositories";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalRepositoryStub } from "@/repositories/stubs";
import { _getGameService } from "../game-service";
import {
  BASIC_SCENE,
  BASIC_STORY,
  BASIC_STORY_PROGRESS,
  BASIC_USER,
} from "../../repositories/stubs/data";

describe("game-service", () => {
  let gameService: ReturnType<typeof _getGameService>;
  let localRepository: LocalRepositoryPort;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date());
  });

  beforeEach(async () => {
    localRepository = getLocalRepositoryStub();

    gameService = _getGameService({
      localRepository,
    });
  });

  describe("saveProgress", () => {
    it("should save the story progress in the local database", async () => {
      const getUserSpy = vi.spyOn(localRepository, "getUser");
      const getSceneSpy = vi.spyOn(localRepository, "getScene");
      const updateProgressSpy = vi.spyOn(
        localRepository,
        "updateStoryProgress",
      );

      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: "tutu",
        sceneActions: [{ text: "bzz bzz" }],
      });

      expect(getUserSpy).toHaveBeenCalled();
      expect(getSceneSpy).toHaveBeenCalledWith("tutu");
      expect(updateProgressSpy).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "tutu",
        history: [...BASIC_STORY_PROGRESS.history, "tutu"],
        lastPlayedAt: new Date(),
        userKey: BASIC_USER.key,
      });
    });

    it("should also work when the user is not logged in", async () => {
      localRepository = {
        ...getLocalRepositoryStub(),
        getUser: () => new Promise((res) => res(null)),
      };
      gameService = _getGameService({ localRepository });

      const getUserSpy = vi.spyOn(localRepository, "getUser");
      const getSceneSpy = vi.spyOn(localRepository, "getScene");
      const updateProgressSpy = vi.spyOn(
        localRepository,
        "updateStoryProgress",
      );

      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: "tutu",
        sceneActions: [{ text: "bzz bzz" }],
      });

      expect(getUserSpy).toHaveBeenCalled();
      expect(getSceneSpy).toHaveBeenCalledWith("tutu");
      expect(updateProgressSpy).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "tutu",
        history: [...BASIC_STORY_PROGRESS.history, "tutu"],
        lastPlayedAt: new Date(),
        userKey: undefined,
      });
    });

    it("should not add to history the same key twice in a row", async () => {
      const updateProgressSpy = vi.spyOn(
        localRepository,
        "updateStoryProgress",
      );

      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: BASIC_STORY_PROGRESS.history.at(-1)!,
        sceneActions: [{ text: "bzz bzz" }],
      });

      expect(updateProgressSpy).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        lastPlayedAt: new Date(),
      });
    });

    it("should mark as finished if the story ends on this scene", async () => {
      const updateProgressSpy = vi.spyOn(
        localRepository,
        "updateStoryProgress",
      );

      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: "bim",
        sceneActions: [],
      });

      expect(updateProgressSpy).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "bim",
        history: [...BASIC_STORY_PROGRESS.history, "bim"],
        lastPlayedAt: new Date(),
        userKey: BASIC_USER.key,
        finished: true,
      });
    });
  });

  describe("getOrCreateStoryProgress", () => {
    it("should return existing progress if one already exists", async () => {
      const getUserSpy = vi.spyOn(localRepository, "getUser");
      const getSPSpy = vi.spyOn(localRepository, "getStoryProgress");
      const createSPSpy = vi.spyOn(localRepository, "createStoryProgress");

      const createdProgress =
        await gameService.getOrCreateStoryProgress(BASIC_STORY);

      expect(getUserSpy).toHaveBeenCalled();
      expect(getSPSpy).toHaveBeenCalledWith(BASIC_STORY.key);
      expect(createSPSpy).not.toHaveBeenCalled();

      expect(createdProgress).toStrictEqual(BASIC_STORY_PROGRESS);
    });

    it("should create a story progress in the local database", async () => {
      localRepository = {
        ...getLocalRepositoryStub(),
        getStoryProgress: () => new Promise((res) => res(null)),
      };
      gameService = _getGameService({ localRepository });

      const getUserSpy = vi.spyOn(localRepository, "getUser");
      const getSPSpy = vi.spyOn(localRepository, "getStoryProgress");
      const createSPSpy = vi.spyOn(localRepository, "createStoryProgress");

      const createdProgress =
        await gameService.getOrCreateStoryProgress(BASIC_STORY);

      expect(getUserSpy).toHaveBeenCalled();
      expect(getSPSpy).toHaveBeenCalledWith(BASIC_STORY.key);
      expect(createSPSpy).toHaveBeenCalledWith({
        history: [BASIC_STORY.firstSceneKey],
        currentSceneKey: BASIC_STORY.firstSceneKey,
        lastPlayedAt: new Date(),
        userKey: BASIC_USER.key,
        storyKey: BASIC_STORY.key,
      });

      expect(createdProgress).toStrictEqual(BASIC_STORY_PROGRESS);
    });
  });

  describe("getLastGamePlayed", () => {
    it("should return the last story played", async () => {
      const progressSpy = vi.spyOn(
        localRepository,
        "getMostRecentStoryProgress",
      );
      const storySpy = vi.spyOn(localRepository, "getStory");

      await gameService.getLastGamePlayed();

      expect(progressSpy).toHaveBeenCalledWith(BASIC_USER.key);
      expect(storySpy).toHaveBeenCalledWith(BASIC_STORY_PROGRESS.storyKey);
    });
  });

  describe("getSceneData", () => {
    it("should return the specified scene", async () => {
      const spy = vi.spyOn(localRepository, "getScene");

      await gameService.getSceneData("plouf");

      expect(spy).toHaveBeenCalledWith("plouf");
    });
  });

  describe("getFirstSceneData", () => {
    it("should retrieve first scene data", async () => {
      const getStorySpy = vi.spyOn(localRepository, "getStory");
      const getSceneSpy = vi.spyOn(localRepository, "getScene");

      const { story, scene } = await gameService.getFirstSceneData("brouhaha");

      expect(getStorySpy).toHaveBeenCalledWith("brouhaha");
      expect(getSceneSpy).toHaveBeenCalledWith(BASIC_STORY.firstSceneKey);
      expect(story).toStrictEqual(BASIC_STORY);
      expect(scene).toStrictEqual(BASIC_SCENE);
    });

    it("should return null story and null scenes if storyKey is invalid", async () => {
      localRepository = {
        ...getLocalRepositoryStub(),
        getStory: () => new Promise((res) => res(null)),
      };

      gameService = _getGameService({ localRepository });

      const getStorySpy = vi.spyOn(localRepository, "getStory");
      const getSceneSpy = vi.spyOn(localRepository, "getScene");

      const { story, scene } =
        await gameService.getFirstSceneData("pipoupipou");

      expect(getStorySpy).toHaveBeenCalledWith("pipoupipou");
      expect(getSceneSpy).not.toHaveBeenCalled();

      expect(story).toBeNull();
      expect(scene).toBeNull();
    });
  });

  describe("getStoryProgress", () => {
    it("should retrieve story progress", async () => {
      const getSPSpy = vi.spyOn(localRepository, "getStoryProgress");

      const p = await gameService.getStoryProgress("viooooooum");

      expect(getSPSpy).toHaveBeenCalledWith("viooooooum");

      expect(p).toStrictEqual(BASIC_STORY_PROGRESS);
    });
  });

  describe("getStoryProgresses", () => {
    it("should retrieve progresses", async () => {
      const userSpy = vi.spyOn(localRepository, "getUser");
      const getSPSpy = vi.spyOn(localRepository, "getStoryProgresses");

      const p = await gameService.getStoryProgresses();

      expect(userSpy).toHaveBeenCalled();
      expect(getSPSpy).toHaveBeenCalledWith(BASIC_USER.key);

      expect(p).toStrictEqual([BASIC_STORY_PROGRESS]);
    });

    describe("loadGamesState", () => {
      it("should load state in the local database", async () => {
        const uowSpy = vi.spyOn(localRepository, "unitOfWork");
        const SPspy = vi.spyOn(
          localRepository,
          "updateOrCreateStoryProgresses",
        );
        const storySpy = vi.spyOn(localRepository, "updateOrCreateStories");
        const sceneSpy = vi.spyOn(localRepository, "updateOrCreateScenes");

        await gameService.loadGamesState({
          progresses: [BASIC_STORY_PROGRESS],
          libraryStories: { stories: [BASIC_STORY], scenes: [BASIC_SCENE] },
        });

        expect(uowSpy).toHaveBeenCalled();
        expect(SPspy).toHaveBeenCalledWith([BASIC_STORY_PROGRESS]);
        expect(storySpy).toHaveBeenCalledWith([BASIC_STORY]);
        expect(sceneSpy).toHaveBeenCalledWith([BASIC_SCENE]);
      });
    });
  });
});
