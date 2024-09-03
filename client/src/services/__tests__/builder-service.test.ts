import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalRepositoryStub } from "@/repositories/stubs/local-repository-stub";
import { getRemoteRepositoryStub } from "@/repositories/stubs/remote-repository-stub";
import { LocalRepositoryPort, RemoteRepositoryPort } from "@/repositories";
import {
  BASIC_SCENE,
  BASIC_USER,
  BASIC_STORY,
} from "../../repositories/stubs/data";
import { _getBuilderService } from "../builder-service";

describe("builder-service", () => {
  let builderService: ReturnType<typeof _getBuilderService>;
  let localRepository: LocalRepositoryPort;
  let remoteRepository: RemoteRepositoryPort;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    remoteRepository = getRemoteRepositoryStub();

    builderService = _getBuilderService({
      localRepository,
      remoteRepository,
    });
  });

  describe("updateSceneBuilderPosition", () => {
    it("should update node position", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.updateSceneBuilderPosition("tutu", {
        x: 42,
        y: 42,
      });

      expect(spy).toHaveBeenCalledWith("tutu", {
        builderParams: { position: { x: 42, y: 42 } },
      });
    });
  });

  describe("addSceneConnection", () => {
    it("should add connection between scenes", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.addSceneConnection({
        sourceScene: BASIC_SCENE,
        destinationSceneKey: "dest",
        actionIndex: 0,
      });

      expect(spy).toHaveBeenCalledWith(BASIC_SCENE.key, {
        actions: [{ text: "action A", sceneKey: "dest" }, { text: "action B" }],
      });
    });

    it("should do nothing when given out of bounds index", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.addSceneConnection({
        sourceScene: BASIC_SCENE,
        destinationSceneKey: "dest",
        actionIndex: 42,
      });

      expect(spy).toHaveBeenCalledWith(BASIC_SCENE.key, {
        actions: BASIC_SCENE.actions,
      });
    });

    it("should do nothing when given negative index", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.addSceneConnection({
        sourceScene: BASIC_SCENE,
        destinationSceneKey: "dest",
        actionIndex: -1,
      });

      expect(spy).toHaveBeenCalledWith(BASIC_SCENE.key, {
        actions: BASIC_SCENE.actions,
      });
    });
  });

  describe("removeSceneConnection", () => {
    it("should remove connection between scenes", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.removeSceneConnection({
        sourceScene: {
          ...BASIC_SCENE,
          actions: [
            { text: "action A", sceneKey: "zut" },
            { text: "action B", sceneKey: "flûte" },
          ],
        },
        actionIndex: 0,
      });

      expect(spy).toHaveBeenCalledWith(BASIC_SCENE.key, {
        actions: [
          { text: "action A", sceneKey: undefined },
          { text: "action B", sceneKey: "flûte" },
        ],
      });
    });

    it("should do nothing when given out of bounds index", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.removeSceneConnection({
        sourceScene: {
          ...BASIC_SCENE,
          actions: [
            { text: "action A", sceneKey: "zut" },
            { text: "action B", sceneKey: "flûte" },
          ],
        },
        actionIndex: 42,
      });

      expect(spy).toHaveBeenCalledWith(BASIC_SCENE.key, {
        actions: [
          { text: "action A", sceneKey: "zut" },
          { text: "action B", sceneKey: "flûte" },
        ],
      });
    });

    it("should do nothing when given negative index", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.removeSceneConnection({
        sourceScene: {
          ...BASIC_SCENE,
          actions: [
            { text: "action A", sceneKey: "zut" },
            { text: "action B", sceneKey: "flûte" },
          ],
        },
        actionIndex: -42,
      });

      expect(spy).toHaveBeenCalledWith(BASIC_SCENE.key, {
        actions: [
          { text: "action A", sceneKey: "zut" },
          { text: "action B", sceneKey: "flûte" },
        ],
      });
    });
  });

  describe("createStoryWithFirstScene", () => {
    it("should create story and first scene", async () => {
      localRepository = {
        ...getLocalRepositoryStub(),
        getUser: () => new Promise((res) => res(null)),
      };
      builderService = _getBuilderService({
        localRepository,
        remoteRepository,
      });

      const userSpy = vi.spyOn(localRepository, "getUser");
      const spy = vi.spyOn(localRepository, "createStoryWithFirstScene");

      await builderService.createStoryWithFirstScene({
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
      });

      expect(userSpy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        story: {
          title: "Tidadoum dam tidididoum",
          description: "Waouh, impressionant...",
          image: "http://image.com",
          genres: ["adventure", "children"],
          creationDate: new Date(),
          status: "draft",
        },
        firstScene: {
          builderParams: { position: { x: 0, y: 0 } },
          content: "This is a placeholder content for your first scene",
          title: "Your first scene",
          actions: [
            {
              text: "An action that leads to a scene",
            },
            {
              text: "An action that leads to another scene",
            },
          ],
        },
      });
    });

    it("should add author if user is logged in", async () => {
      const userSpy = vi.spyOn(localRepository, "getUser");
      const spy = vi.spyOn(localRepository, "createStoryWithFirstScene");

      await builderService.createStoryWithFirstScene({
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
      });

      expect(userSpy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        story: {
          title: "Tidadoum dam tidididoum",
          description: "Waouh, impressionant...",
          image: "http://image.com",
          genres: ["adventure", "children"],
          creationDate: new Date(),
          status: "draft",
          author: { username: BASIC_USER.username, key: BASIC_USER.key },
        },
        firstScene: {
          builderParams: { position: { x: 0, y: 0 } },
          content: "This is a placeholder content for your first scene",
          title: "Your first scene",
          actions: [
            {
              text: "An action that leads to a scene",
            },
            {
              text: "An action that leads to another scene",
            },
          ],
        },
      });
    });
  });

  describe("publishStory", () => {
    it("should publish the story", async () => {
      const publishSpy = vi.spyOn(remoteRepository, "publishStory");
      const localUpdateSpy = vi.spyOn(localRepository, "updateStory");

      const success = await builderService.publishStory(
        [BASIC_SCENE],
        BASIC_STORY,
      );

      expect(publishSpy).toHaveBeenCalledWith([BASIC_SCENE], BASIC_STORY);
      expect(localUpdateSpy).toHaveBeenCalled();

      expect(success).toBeTruthy();
    });

    it("should not update local repository if remote update failed", async () => {
      remoteRepository = {
        ...getRemoteRepositoryStub(),
        publishStory: () => new Promise((res) => res({ error: "Error" })),
      };
      builderService = _getBuilderService({
        localRepository,
        remoteRepository,
      });

      const publishSpy = vi.spyOn(remoteRepository, "publishStory");
      const localUpdateSpy = vi.spyOn(localRepository, "updateStory");

      const success = await builderService.publishStory(
        [BASIC_SCENE],
        BASIC_STORY,
      );

      expect(publishSpy).toHaveBeenCalledWith([BASIC_SCENE], BASIC_STORY);
      expect(localUpdateSpy).not.toHaveBeenCalled();

      expect(success).toBeFalsy();
    });
  });

  describe("addScene", () => {
    it("should add scene to local database", async () => {
      const spy = vi.spyOn(localRepository, "createScene");

      await builderService.addScene(BASIC_SCENE);

      expect(spy).toHaveBeenCalledWith(BASIC_SCENE);
    });
  });

  describe("updateStory", () => {
    it("should update story in the local database", async () => {
      const spy = vi.spyOn(localRepository, "updateStory");

      await builderService.updateStory({
        ...BASIC_STORY,
        title: "Pipou",
        description: "yeehaaaw",
      });

      expect(spy).toHaveBeenCalledWith({
        ...BASIC_STORY,
        title: "Pipou",
        description: "yeehaaaw",
      });
    });
  });

  describe("updateScene", () => {
    it("should only update specified parts of the scene", async () => {
      const spy = vi.spyOn(localRepository, "updatePartialScene");

      await builderService.updateScene({ content: "tututu", key: "blabla" });

      expect(spy).toHaveBeenCalledWith("blabla", {
        content: "tututu",
      });
    });
  });

  describe("changeFirstScene", () => {
    it("should update the first scene of a story", async () => {
      const getSceneSpy = vi.spyOn(localRepository, "getScene");
      const updateFirstScene = vi.spyOn(localRepository, "updateFirstScene");

      const success = await builderService.changeFirstScene("CANARD", "KADOC");

      expect(getSceneSpy).toHaveBeenCalledWith("KADOC");
      expect(updateFirstScene).toHaveBeenCalledWith("CANARD", "KADOC");

      expect(success).toBeTruthy();
    });

    it("should not update the story if the scene key is invalid", async () => {
      localRepository = {
        ...getLocalRepositoryStub(),
        getScene: () => new Promise((res) => res(null)),
      };
      builderService = _getBuilderService({
        localRepository,
        remoteRepository,
      });

      const getSceneSpy = vi.spyOn(localRepository, "getScene");
      const updateFirstScene = vi.spyOn(localRepository, "updateFirstScene");

      const success = await builderService.changeFirstScene("CANARD", "KADOC");

      expect(getSceneSpy).toHaveBeenCalledWith("KADOC");
      expect(updateFirstScene).not.toHaveBeenCalled();

      expect(success).toBeFalsy();
    });
  });

  describe("getBuilderStoryData", () => {
    it("should return story data", async () => {
      const getStorySpy = vi.spyOn(localRepository, "getStory");
      const getScenesSpy = vi.spyOn(localRepository, "getScenes");

      const builderData = await builderService.getBuilderStoryData("bouteille");

      expect(getStorySpy).toHaveBeenCalledWith("bouteille");
      expect(getScenesSpy).toHaveBeenCalledWith("bouteille");
      expect(builderData).toStrictEqual({
        story: BASIC_STORY,
        scenes: [BASIC_SCENE],
      });
    });
  });

  describe("getUserBuilderStories", () => {
    it("should retrieve stories created by logged in user", async () => {
      const getUserSpy = vi.spyOn(localRepository, "getUser");
      const getStoriesSpy = vi.spyOn(localRepository, "getStoriesByAuthor");

      const stories = await builderService.getUserBuilderStories();

      expect(getUserSpy).toHaveBeenCalled();
      expect(getStoriesSpy).toHaveBeenCalledTimes(2);
      expect(getStoriesSpy).toHaveBeenCalledWith(BASIC_USER.key);
      expect(getStoriesSpy).toHaveBeenCalledWith(undefined);
      expect(stories).toStrictEqual([BASIC_STORY, BASIC_STORY]);
    });
  });

  describe("getFullBuilderState", () => {
    it("should get all stories and scenes", async () => {
      const getScenesSpy = vi.spyOn(localRepository, "getScenes");

      const result = await builderService.getFullBuilderState();

      expect(getScenesSpy).toHaveBeenCalled();
      expect(result).toStrictEqual({
        stories: [BASIC_STORY, BASIC_STORY],
        scenes: [BASIC_SCENE],
      });
    });
  });

  describe("loadBuilderState", () => {
    it("should update local database with input data", async () => {
      const uowSpy = vi.spyOn(localRepository, "unitOfWork");
      const storiesSpy = vi.spyOn(localRepository, "updateOrCreateStories");
      const scenesSpy = vi.spyOn(localRepository, "updateOrCreateScenes");

      await builderService.loadBuilderState([BASIC_STORY], [BASIC_SCENE]);

      expect(uowSpy).toHaveBeenCalled();
      expect(storiesSpy).toHaveBeenCalledWith([BASIC_STORY]);
      expect(scenesSpy).toHaveBeenCalledWith([BASIC_SCENE]);
    });
  });
});
