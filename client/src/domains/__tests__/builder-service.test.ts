import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs/local-repository-stub";
import {
  BASIC_SCENE,
  BASIC_USER,
  BASIC_STORY,
} from "../../repositories/stubs/data";
import { _getBuilderService } from "../builder/builder-service";
import { BuilderNode } from "@/builder/types";
import { Edge } from "@xyflow/react";
import {
  getStubLayoutService,
  MockLayoutService,
} from "../builder/stub-layout-service";

describe("builder-service", () => {
  let builderService: ReturnType<typeof _getBuilderService>;
  let localRepository: MockLocalRepository;
  let layoutService: MockLayoutService;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    layoutService = getStubLayoutService();

    builderService = _getBuilderService({
      localRepository,
      layoutService,
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
        { ...BASIC_STORY, type: "builder" },
      ]);
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledWith(
        BASIC_USER.key,
      );
      localRepository.getStoriesByAuthor.mockResolvedValueOnce([
        BASIC_STORY,
        { ...BASIC_STORY, type: "imported" },
        { ...BASIC_STORY, type: "builder" },
      ]);
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledWith(
        undefined,
      );
      expect(stories).toStrictEqual([BASIC_STORY, BASIC_STORY]);
    });
  });

  describe("getFullBuilderState", () => {
    it("should get all stories and scenes", async () => {
      const result = await builderService.getAllBuilderData();

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

  describe("deleteStory", () => {
    it("should delete story", async () => {
      localRepository.getScenesByStoryKey.mockResolvedValueOnce([
        { ...BASIC_SCENE, key: "pshit" },
        { ...BASIC_SCENE, key: "zioum" },
      ]);

      await builderService.deleteStory("tutu");

      expect(localRepository.deleteStory).toHaveBeenCalledWith("tutu");
      expect(localRepository.deleteScenes).toHaveBeenCalledWith([
        "pshit",
        "zioum",
      ]);
      expect(localRepository.deleteStory).toHaveBeenCalledOnce();
      expect(localRepository.deleteScenes).toHaveBeenCalledOnce();
    });
  });

  describe("computeAutoLayout", () => {
    it("should compute new positions", async () => {
      const builderService = _getBuilderService({
        localRepository,
        layoutService,
      });

      const NODES: BuilderNode[] = [
        {
          data: {
            title: "A mysterious crossroads",
            content:
              "You arrive at a crossroads. On the left, a sinuous dirt path leads to a tree mass. The road on the right is a well-maintained paved trail that runs towards a little village in the hills.",
            actions: [
              { text: "Go to the forest" },
              { text: "Go to the village" },
            ],
            isFirstScene: false,
            key: "first-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
          },
          id: "scene-1",
          position: { x: 1111, y: 11111 },
          type: "scene",
        },
        {
          data: {
            title: "The Forest",
            content:
              "After half an hour of walking under the bright sun, you come close to the trees. As the air gets colder, you start hearing birds and other creatures of the forest",
            actions: [],
            isFirstScene: false,
            key: "forest-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
          },
          id: "scene-2",
          position: { x: 2222, y: 2222 },
          type: "scene",
        },
        {
          data: {
            title: "The Road to the Village",
            content:
              "You walk alongside an - for most of it - even path that leads you under the protecting shadows of the hills. You maintain a quick pace. After a moment, you begin feeling like something is watching you.",
            actions: [],
            isFirstScene: false,
            key: "village-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
          },
          id: "scene-3",
          position: { x: 3333, y: 3333 },
          type: "scene",
        },
      ];

      const EDGES: Edge[] = [
        {
          id: "edge-1",
          source: "scene-1",
          target: "scene-2",
          sourceHandle: "first-fake-scene-key-0",
        },
        {
          id: "edge-2",
          source: "scene-1",
          target: "scene-3",
          sourceHandle: "first-fake-scene-key-1",
        },
      ];

      localRepository.getStory.mockResolvedValueOnce({
        creationDate: new Date(),
        description: "description",
        firstSceneKey: "first-fake-scene-key",
        genres: [],
        image: "http://image.com",
        key: "fake-story-key",
        title: "title",
        type: "builder",
      });

      const SCENES = [
        {
          key: "first-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 1111, y: 1111 } },
          content: "content",
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "forest-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 2222, y: 2222 } },
          content: "content",
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "village-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 3333, y: 3333 } },
          content: "content",
          storyKey: "fake-story-key",
          title: "title",
        },
      ];

      localRepository.getScenesByStoryKey.mockResolvedValueOnce(SCENES);

      layoutService.computeAutoLayout.mockResolvedValueOnce([
        {
          data: {
            title: "A mysterious crossroads",
            content:
              "You arrive at a crossroads. On the left, a sinuous dirt path leads to a tree mass. The road on the right is a well-maintained paved trail that runs towards a little village in the hills.",
            actions: [
              { text: "Go to the forest" },
              { text: "Go to the village" },
            ],
            isFirstScene: false,
            key: "first-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
          },
          id: "first-fake-scene-key",
          position: { x: 1, y: 1 },
          type: "scene",
        },
        {
          data: {
            title: "The Forest",
            content:
              "After half an hour of walking under the bright sun, you come close to the trees. As the air gets colder, you start hearing birds and other creatures of the forest",
            actions: [],
            isFirstScene: false,
            key: "forest-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
          },
          id: "forest-fake-scene-key",
          position: { x: 2, y: 2 },
          type: "scene",
        },
        {
          data: {
            title: "The Road to the Village",
            content:
              "You walk alongside an - for most of it - even path that leads you under the protecting shadows of the hills. You maintain a quick pace. After a moment, you begin feeling like something is watching you.",
            actions: [],
            isFirstScene: false,
            key: "village-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
          },
          id: "village-fake-scene-key",
          position: { x: 3, y: 3 },
          type: "scene",
        },
      ]);

      const result = await builderService.getAutoLayout({
        storyKey: "fake-story-key",
        edges: EDGES,
        nodes: NODES,
      });

      expect(result.before).toStrictEqual(SCENES);
      expect(result.after).toStrictEqual([
        {
          key: "first-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 1, y: 1 } },
          content: "content",
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "forest-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 2, y: 2 } },
          content: "content",
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "village-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 3, y: 3 } },
          content: "content",
          storyKey: "fake-story-key",
          title: "title",
        },
      ]);
    });
  });

  describe("bulkUpdateScenes", () => {
    it("should update or create scenes with", async () => {
      await builderService.bulkUpdateScenes({ scenes: [BASIC_SCENE] });

      expect(localRepository.updateOrCreateScenes).toHaveBeenCalledOnce();
      expect(localRepository.updateOrCreateScenes).toHaveBeenCalledWith([
        BASIC_SCENE,
      ]);
    });
  });
});
