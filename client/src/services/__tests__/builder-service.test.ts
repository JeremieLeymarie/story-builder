import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs/local-repository-stub";
import {
  getRemoteRepositoryStub,
  MockRemoteRepository,
} from "@/repositories/stubs/remote-repository-stub";
import {
  BASIC_SCENE,
  BASIC_USER,
  BASIC_STORY,
} from "../../repositories/stubs/data";
import { _getBuilderService } from "../builder-service";

describe("builder-service", () => {
  let builderService: ReturnType<typeof _getBuilderService>;
  let localRepository: MockLocalRepository;
  let remoteRepository: MockRemoteRepository;

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
      await builderService.updateSceneBuilderPosition("tutu", {
        x: 42,
        y: 42,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith("tutu", {
        builderParams: { position: { x: 42, y: 42 } },
      });
    });
  });

  describe("addSceneConnection", () => {
    it("should add connection between scenes", async () => {
      await builderService.addSceneConnection({
        sourceScene: BASIC_SCENE,
        destinationSceneKey: "dest",
        actionIndex: 0,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            { text: "action A", sceneKey: "dest" },
            { text: "action B" },
          ],
        },
      );
    });

    it("should do nothing when given out of bounds index", async () => {
      await builderService.addSceneConnection({
        sourceScene: BASIC_SCENE,
        destinationSceneKey: "dest",
        actionIndex: 42,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: BASIC_SCENE.actions,
        },
      );
    });

    it("should do nothing when given negative index", async () => {
      await builderService.addSceneConnection({
        sourceScene: BASIC_SCENE,
        destinationSceneKey: "dest",
        actionIndex: -1,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: BASIC_SCENE.actions,
        },
      );
    });
  });

  describe("removeSceneConnection", () => {
    it("should remove connection between scenes", async () => {
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

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            { text: "action A", sceneKey: undefined },
            { text: "action B", sceneKey: "flûte" },
          ],
        },
      );
    });

    it("should do nothing when given out of bounds index", async () => {
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

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            { text: "action A", sceneKey: "zut" },
            { text: "action B", sceneKey: "flûte" },
          ],
        },
      );
    });

    it("should do nothing when given negative index", async () => {
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

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            { text: "action A", sceneKey: "zut" },
            { text: "action B", sceneKey: "flûte" },
          ],
        },
      );
    });
  });

  describe("createStoryWithFirstScene", () => {
    it("should create story and first scene", async () => {
      localRepository.getUser.mockResolvedValueOnce(null);

      await builderService.createStoryWithFirstScene({
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
      });

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.createStoryWithFirstScene).toHaveBeenCalledWith({
        story: {
          title: "Tidadoum dam tidididoum",
          description: "Waouh, impressionant...",
          image: "http://image.com",
          genres: ["adventure", "children"],
          creationDate: new Date(),
          type: "builder",
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
      await builderService.createStoryWithFirstScene({
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
      });

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.createStoryWithFirstScene).toHaveBeenCalledWith({
        story: {
          title: "Tidadoum dam tidididoum",
          description: "Waouh, impressionant...",
          image: "http://image.com",
          genres: ["adventure", "children"],
          creationDate: new Date(),
          type: "builder",
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
      const success = await builderService.publishStory(
        [BASIC_SCENE],
        BASIC_STORY,
      );

      expect(remoteRepository.publishStory).toHaveBeenCalledWith(
        [BASIC_SCENE],
        BASIC_STORY,
      );
      expect(localRepository.updateStory).toHaveBeenCalled();

      expect(success).toBeTruthy();
    });

    it("should not update local repository if remote update failed", async () => {
      remoteRepository.publishStory.mockResolvedValueOnce({ error: "Error" });

      const success = await builderService.publishStory(
        [BASIC_SCENE],
        BASIC_STORY,
      );

      expect(remoteRepository.publishStory).toHaveBeenCalledWith(
        [BASIC_SCENE],
        BASIC_STORY,
      );
      expect(localRepository.updateStory).not.toHaveBeenCalled();

      expect(success).toBeFalsy();
    });
  });

  describe("addScene", () => {
    it("should add scene to local database", async () => {
      await builderService.addScene(BASIC_SCENE);

      expect(localRepository.createScene).toHaveBeenCalledWith(BASIC_SCENE);
    });
  });

  describe("updateStory", () => {
    it("should update story in the local database", async () => {
      await builderService.updateStory({
        ...BASIC_STORY,
        title: "Pipou",
        description: "yeehaaaw",
      });

      expect(localRepository.updateStory).toHaveBeenCalledWith({
        ...BASIC_STORY,
        title: "Pipou",
        description: "yeehaaaw",
      });
    });
  });

  describe("updateScene", () => {
    it("should only update specified parts of the scene", async () => {
      await builderService.updateScene({ content: "tututu", key: "blabla" });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        "blabla",
        {
          content: "tututu",
        },
      );
    });
  });

  describe("changeFirstScene", () => {
    it("should update the first scene of a story", async () => {
      const success = await builderService.changeFirstScene("CANARD", "KADOC");

      expect(localRepository.getScene).toHaveBeenCalledWith("KADOC");
      expect(localRepository.updateFirstScene).toHaveBeenCalledWith(
        "CANARD",
        "KADOC",
      );

      expect(success).toBeTruthy();
    });

    it("should not update the story if the scene key is invalid", async () => {
      localRepository.getScene.mockResolvedValueOnce(null);

      const success = await builderService.changeFirstScene("CANARD", "KADOC");

      expect(localRepository.getScene).toHaveBeenCalledWith("KADOC");
      expect(localRepository.updateFirstScene).not.toHaveBeenCalled();

      expect(success).toBeFalsy();
    });
  });

  describe("getBuilderStoryData", () => {
    it("should return story data", async () => {
      const builderData = await builderService.getBuilderStoryData("bouteille");

      expect(localRepository.getStory).toHaveBeenCalledWith("bouteille");
      expect(localRepository.getScenesByStoryKey).toHaveBeenCalledWith(
        "bouteille",
      );
      expect(builderData).toStrictEqual({
        story: BASIC_STORY,
        scenes: [BASIC_SCENE],
      });
    });
  });

  describe("getUserBuilderStories", () => {
    it("should retrieve stories created by logged in user", async () => {
      const stories = await builderService.getUserBuilderStories();

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledTimes(2);
      localRepository.getStoriesByAuthor.mockResolvedValueOnce([
        BASIC_STORY,
        { ...BASIC_STORY, type: "imported" },
        { ...BASIC_STORY, type: "published", publicationDate: new Date() },
      ]);
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledWith(
        BASIC_USER.key,
      );
      localRepository.getStoriesByAuthor.mockResolvedValueOnce([
        BASIC_STORY,
        { ...BASIC_STORY, type: "imported" },
        { ...BASIC_STORY, type: "published", publicationDate: new Date() },
      ]);
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledWith(
        undefined,
      );
      expect(stories).toStrictEqual([BASIC_STORY, BASIC_STORY]);
    });
  });

  describe("getFullBuilderState", () => {
    it("should get all stories and scenes", async () => {
      const result = await builderService.getFullBuilderState();

      expect(localRepository.getScenesByStoryKey).toHaveBeenCalled();
      expect(result).toStrictEqual({
        stories: [BASIC_STORY, BASIC_STORY],
        scenes: [BASIC_SCENE],
      });
    });
  });

  describe("loadBuilderState", () => {
    it("should update local database with input data", async () => {
      await builderService.loadBuilderState([BASIC_STORY], [BASIC_SCENE]);

      expect(localRepository.unitOfWork).toHaveBeenCalled();
      expect(localRepository.updateOrCreateStories).toHaveBeenCalledWith([
        BASIC_STORY,
      ]);
      expect(localRepository.updateOrCreateScenes).toHaveBeenCalledWith([
        BASIC_SCENE,
      ]);
    });
  });

  describe("deleteScenes", () => {
    it("should delete scenes", async () => {
      await builderService.deleteScenes(["ti", "ta", "tu"]);

      expect(localRepository.deleteScenes).toHaveBeenCalledWith([
        "ti",
        "ta",
        "tu",
      ]);
      expect(localRepository.deleteScenes).toHaveBeenCalledOnce();
    });
  });
});
