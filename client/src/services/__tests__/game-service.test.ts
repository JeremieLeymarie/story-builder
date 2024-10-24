import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs";
import { _getGameService } from "../game-service";
import {
  BASIC_SCENE,
  BASIC_STORY,
  BASIC_STORY_PROGRESS,
  BASIC_USER,
} from "../../repositories/stubs/data";

describe("game-service", () => {
  let gameService: ReturnType<typeof _getGameService>;
  let localRepository: MockLocalRepository;

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
      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: "tutu",
        sceneActions: [{ text: "bzz bzz" }],
      });

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getScene).toHaveBeenCalledWith("tutu");
      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "tutu",
        history: [...BASIC_STORY_PROGRESS.history, "tutu"],
        lastPlayedAt: new Date(),
        userKey: BASIC_USER.key,
      });
    });

    it("should also work when the user is not logged in", async () => {
      localRepository.getUser.mockResolvedValueOnce(null);

      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: "tutu",
        sceneActions: [{ text: "bzz bzz" }],
      });

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getScene).toHaveBeenCalledWith("tutu");
      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "tutu",
        history: [...BASIC_STORY_PROGRESS.history, "tutu"],
        lastPlayedAt: new Date(),
        userKey: undefined,
      });
    });

    it("should not add to history the same key twice in a row", async () => {
      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: BASIC_STORY_PROGRESS.history.at(-1)!,
        sceneActions: [{ text: "bzz bzz" }],
      });

      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        lastPlayedAt: new Date(),
      });
    });

    it("should mark as finished if the story ends on this scene", async () => {
      await gameService.saveProgress(BASIC_STORY_PROGRESS, {
        currentSceneKey: "bim",
        sceneActions: [],
      });

      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
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
      const createdProgress =
        await gameService.getOrCreateStoryProgress(BASIC_STORY);

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getStoryProgresses).toHaveBeenCalledWith(
        BASIC_STORY.key,
      );
      expect(localRepository.createStoryProgress).not.toHaveBeenCalled();

      expect(createdProgress).toStrictEqual(BASIC_STORY_PROGRESS);
    });

    it("should create a story progress in the local database", async () => {
      localRepository.getStoryProgresses.mockResolvedValueOnce(null);

      const createdProgress =
        await gameService.getOrCreateStoryProgress(BASIC_STORY);

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getStoryProgresses).toHaveBeenCalledWith(
        BASIC_STORY.key,
      );
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

  describe("getLastGamePlayed", () => {
    it("should return the last story played", async () => {
      await gameService.getLastGamePlayed();

      expect(localRepository.getMostRecentStoryProgress).toHaveBeenCalledWith(
        BASIC_USER.key,
      );
      expect(localRepository.getStory).toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.storyKey,
      );
    });
  });

  describe("getSceneData", () => {
    it("should return the specified scene", async () => {
      await gameService.getSceneData("plouf");

      expect(localRepository.getScene).toHaveBeenCalledWith("plouf");
    });
  });

  describe("getFirstSceneData", () => {
    it("should retrieve first scene data", async () => {
      const { story, scene } = await gameService.getFirstSceneData("brouhaha");

      expect(localRepository.getStory).toHaveBeenCalledWith("brouhaha");
      expect(localRepository.getScene).toHaveBeenCalledWith(
        BASIC_STORY.firstSceneKey,
      );
      expect(story).toStrictEqual(BASIC_STORY);
      expect(scene).toStrictEqual(BASIC_SCENE);
    });

    it("should return null story and null scenes if storyKey is invalid", async () => {
      localRepository.getStory.mockResolvedValueOnce(null);

      gameService = _getGameService({ localRepository });

      const { story, scene } =
        await gameService.getFirstSceneData("pipoupipou");

      expect(localRepository.getStory).toHaveBeenCalledWith("pipoupipou");
      expect(localRepository.getScene).not.toHaveBeenCalled();

      expect(story).toBeNull();
      expect(scene).toBeNull();
    });
  });

  describe("getStoryProgress", () => {
    it("should retrieve story progress", async () => {
      const p = await gameService.getStoryProgress("viooooooum");

      expect(localRepository.getStoryProgresses).toHaveBeenCalledWith(
        "viooooooum",
      );

      expect(p).toStrictEqual(BASIC_STORY_PROGRESS);
    });
  });

  describe("getStoryProgresses", () => {
    it("should retrieve progresses", async () => {
      const p = await gameService.getStoryProgresses();

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getUserStoryProgresses).toHaveBeenCalledWith(
        BASIC_USER.key,
      );

      expect(p).toStrictEqual([BASIC_STORY_PROGRESS]);
    });

    describe("loadGamesState", () => {
      it("should load state in the local database", async () => {
        await gameService.loadGamesState({
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
});
