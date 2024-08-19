import { LocalRepositoryPort, RemoteRepositoryPort } from "@/repositories";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLocalRepositoryStub,
  getRemoteRepositoryStub,
} from "@/repositories/stubs";
import { _getGameService } from "../game-service";
import { StoryProgress, User } from "@/lib/storage/domain";
import dayjs from "dayjs";
import { BASE_SCENE, BASE_STORY } from "./data";
import { _getBuilderService } from "../builder";

describe("game-service", () => {
  let gameService: ReturnType<typeof _getGameService>;
  let localRepository: LocalRepositoryPort;
  let remoteRepository: RemoteRepositoryPort;
  let progress: StoryProgress;
  let user: User;
  let builderService: ReturnType<typeof _getBuilderService>;

  const _setUp = async () => {
    localRepository = getLocalRepositoryStub();
    remoteRepository = getRemoteRepositoryStub();

    progress = await localRepository.createStoryProgress({
      history: ["zut"],
      currentSceneKey: "zut",
      storyKey: "plouf",
      lastPlayedAt: new Date(),
    });

    user = await localRepository.createUser({
      username: "bob_bidou",
      email: "bob@mail.com",
    });
  };

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(async () => {
    await _setUp();

    gameService = _getGameService({
      localRepository,
    });

    builderService = _getBuilderService({ localRepository, remoteRepository });
  });

  describe("saveProgress", () => {
    it("should save the story progress in the local database", async () => {
      const now = dayjs(new Date()).add(42, "days").toDate();
      vi.setSystemTime(now);

      const scene = await localRepository.createScene(BASE_SCENE);

      const p = await gameService.saveProgress(progress, {
        currentSceneKey: scene.key,
        sceneActions: [],
      });

      expect(p).toStrictEqual({
        key: p?.key,
        history: ["zut", scene.key],
        currentSceneKey: scene.key,
        storyKey: "plouf",
        lastPlayedAt: now,
        finished: true,
      });
    });

    it("should also work when the user is not logged in", async () => {
      await localRepository.deleteUser(user.key);
      const now = dayjs(new Date()).add(42, "days").toDate();
      vi.setSystemTime(now);

      const scene = await localRepository.createScene(BASE_SCENE);

      const p = await gameService.saveProgress(progress, {
        currentSceneKey: scene.key,
        sceneActions: [],
      });

      expect(p).toStrictEqual({
        key: p?.key,
        history: ["zut", scene.key],
        currentSceneKey: scene.key,
        storyKey: "plouf",
        lastPlayedAt: now,
        finished: true,
      });
    });

    it("should not do anything when the scene key is invalid", async () => {
      const p = await gameService.saveProgress(progress, {
        currentSceneKey: "tututu",
        sceneActions: [],
      });

      expect(p).toBeNull();
    });
  });

  describe("getOrCreateStoryProgress", () => {
    it("should return existing progress if one already exists", async () => {
      const story = {
        ...BASE_STORY,
        key: "plouf",
      };
      // Create story linked to progress
      await localRepository.updateOrCreateStories([story]);

      const createdProgress = await gameService.getOrCreateStoryProgress(story);

      expect(createdProgress).toStrictEqual(progress);
    });

    it("should create a story progress in the local database", async () => {
      const now = dayjs(new Date()).add(42, "days").toDate();
      vi.setSystemTime(now);

      const story = await localRepository.createStory(BASE_STORY);
      if (!story) throw new Error("Could not create story");

      const createdProgress = await gameService.getOrCreateStoryProgress(story);

      expect(createdProgress).toStrictEqual({
        key: createdProgress?.key,
        history: [story.firstSceneKey],
        currentSceneKey: story.firstSceneKey,
        lastPlayedAt: now,
        storyKey: story.key,
      });
    });
  });

  describe("getLastGamePlayed", () => {
    it("should return the last story played", async () => {
      vi.advanceTimersByTime(10000);

      const story = await localRepository.createStory(BASE_STORY);

      if (!story) throw new Error("Could not create story");

      await localRepository.createStoryProgress({
        currentSceneKey: "tutu",
        history: ["tutu"],
        lastPlayedAt: new Date(),
        storyKey: story.key,
      });

      const result = await gameService.getLastGamePlayed();

      expect(result).toStrictEqual(story);
    });
  });

  describe("getSceneData", () => {
    it("should return the specified scene", async () => {
      const createdScene = await localRepository.createScene(BASE_SCENE);

      const scene = await gameService.getSceneData(createdScene.key);

      expect(scene).toStrictEqual(createdScene);
    });
  });

  describe("getFirstSceneData", () => {
    it("should retrieve first scene data", async () => {
      const createdData =
        await builderService.createStoryWithFirstScene(BASE_STORY);

      if (!createdData?.story) throw new Error("Could not create story");

      const { story, scene } = await gameService.getFirstSceneData(
        createdData.story.key,
      );

      expect(story).toStrictEqual(createdData.story);
      expect(scene).toStrictEqual(createdData.scene);
    });

    it("should return null story and null scenes if storyKey is invalid", async () => {
      const { story, scene } =
        await gameService.getFirstSceneData("pipoupipou");

      expect(story).toBeNull();
      expect(scene).toBeNull();
    });
  });

  describe("getStoryProgress", () => {
    it("should retrieve story progress", async () => {
      const p = await gameService.getStoryProgress(progress.storyKey);

      expect(p).toStrictEqual(progress);
    });
  });

  describe("getStoryProgresses", () => {
    it("should retrieve progresses", async () => {
      const otherProgress = await localRepository.createStoryProgress({
        currentSceneKey: "titi",
        history: ["titi"],
        storyKey: "zou",
        lastPlayedAt: new Date(),
      });

      const progresses = await localRepository.getStoryProgresses();

      expect(progresses).toStrictEqual([progress, otherProgress]);
    });

    describe("loadGamesState", () => {
      it("should load state in the local database", async () => {
        const createdData =
          await builderService.createStoryWithFirstScene(BASE_STORY);

        if (!createdData?.story) throw new Error("Could not create story");

        await gameService.loadGamesState({
          progresses: [{ ...progress, history: ["plif", "plaf"] }],
          libraryStories: {
            stories: [
              { ...createdData.story, description: "oulala" },
              { ...BASE_STORY, title: "tatata", key: "prong" },
            ],
            scenes: [{ ...createdData.scene, title: "pichichi" }],
          },
        });

        const storyA = await localRepository.getStory(createdData.story.key);
        const storyB = await localRepository.getStory("prong");
        const scenes = await localRepository.getScenes(createdData.story.key);
        const p = await localRepository.getStoryProgress(progress.storyKey);

        expect(storyA).toStrictEqual({
          ...createdData.story,
          description: "oulala",
        });
        expect(storyB).toStrictEqual({
          ...BASE_STORY,
          title: "tatata",
          key: "prong",
        });
        expect(scenes).toStrictEqual([
          { ...createdData.scene, title: "pichichi" },
        ]);
        expect(p).toStrictEqual({
          ...progress,
          history: ["plif", "plaf"],
        });
      });
    });
  });
});
