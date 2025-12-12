import { beforeAll, beforeEach, describe, expect, it, test, vi } from "vitest";
import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs/local-repository-stub";
import { BuilderNode } from "@/builder/types";
import { Edge } from "@xyflow/react";
import {
  getImportServiceStub,
  MockImportService,
} from "@/services/common/stubs/stub-import-service";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import {
  BASIC_SCENE,
  BASIC_USER,
  BASIC_STORY,
} from "@/repositories/stubs/data";
import { _getBuilderService } from "../builder-service";
import {
  MockBuilderStoryRepository,
  getStubBuilderStoryRepository,
} from "../stubs/stub-builder-story-repository";
import {
  MockLayoutService,
  getStubLayoutService,
} from "../stubs/stub-layout-service";
import {
  MOCK_IMPORTED_STORY,
  MOCK_IMPORTED_SCENE,
} from "@/domains/__tests__/data/imported-story-mocks";
import { getTestFactory } from "@/lib/testing/factory";
import { EntityNotExistError } from "@/domains/errors";
import {
  CannotDeleteFirstSceneError,
  DuplicationMissingPositionError,
} from "../errors";
import {
  getStubBuilderSceneRepository,
  MockBuilderSceneRepository,
} from "../stubs/stub-builder-scene-repository";
import { Scene } from "@/lib/storage/domain";

const factory = getTestFactory();

describe("builder-service", () => {
  let builderService: ReturnType<typeof _getBuilderService>;
  let localRepository: MockLocalRepository;
  let layoutService: MockLayoutService;
  let importService: MockImportService;
  let storyRepository: MockBuilderStoryRepository;
  let sceneRepository: MockBuilderSceneRepository;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    layoutService = getStubLayoutService();
    importService = getImportServiceStub();
    storyRepository = getStubBuilderStoryRepository();
    sceneRepository = getStubBuilderSceneRepository();

    builderService = _getBuilderService({
      localRepository,
      importService,
      layoutService,
      storyRepository,
      sceneRepository,
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
        sourceSceneKey: BASIC_SCENE.key,
        destinationSceneKey: "dest",
        actionIndex: 0,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            { type: "simple", text: "action A", sceneKey: "dest" },
            { type: "simple", text: "action B" },
          ],
        },
      );
    });

    it("should do nothing when given out of bounds index", async () => {
      await builderService.addSceneConnection({
        sourceSceneKey: BASIC_SCENE.key,
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
        sourceSceneKey: BASIC_SCENE.key,
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
            {
              type: "simple",
              text: "action A",
              targets: [{ sceneKey: "zut", probability: 100 }],
            },
            {
              type: "simple",
              text: "action B",
              targets: [{ sceneKey: "flûte", probability: 100 }],
            },
          ],
        },
        actionIndex: 0,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            {
              type: "simple",
              text: "action A",
              targets: [],
            },
            {
              type: "simple",
              text: "action B",
              targets: [{ sceneKey: "flûte", probability: 100 }],
            },
          ],
        },
      );
    });

    it("should do nothing when given out of bounds index", async () => {
      await builderService.removeSceneConnection({
        sourceScene: {
          ...BASIC_SCENE,
          actions: [
            {
              type: "simple",
              text: "action A",
              targets: [{ sceneKey: "zut", probability: 100 }],
            },
            {
              type: "simple",
              text: "action B",
              targets: [{ sceneKey: "flûte", probability: 100 }],
            },
          ],
        },
        actionIndex: 42,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            {
              type: "simple",
              text: "action A",
              targets: [{ sceneKey: "zut", probability: 100 }],
            },
            {
              type: "simple",
              text: "action B",
              targets: [{ sceneKey: "flûte", probability: 100 }],
            },
          ],
        },
      );
    });

    it("should do nothing when given negative index", async () => {
      await builderService.removeSceneConnection({
        sourceScene: {
          ...BASIC_SCENE,
          actions: [
            {
              type: "simple",
              text: "action A",
              targets: [{ sceneKey: "zut", probability: 100 }],
            },
            {
              type: "simple",
              text: "action B",
              targets: [{ sceneKey: "flûte", probability: 100 }],
            },
          ],
        },
        actionIndex: -42,
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        BASIC_SCENE.key,
        {
          actions: [
            {
              type: "simple",
              text: "action A",
              targets: [{ sceneKey: "zut", probability: 100 }],
            },
            {
              type: "simple",
              text: "action B",
              targets: [{ sceneKey: "flûte", probability: 100 }],
            },
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
          content: makeSimpleLexicalContent(
            "This is a placeholder content for your first scene",
          ),
          title: "Your first scene",
          actions: [
            {
              type: "simple",
              text: "An action that leads to a scene",
            },
            {
              type: "simple",
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
          content: makeSimpleLexicalContent(
            "This is a placeholder content for your first scene",
          ),
          title: "Your first scene",
          actions: [
            {
              type: "simple",
              text: "An action that leads to a scene",
            },
            {
              type: "simple",
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

  describe("updateScene", () => {
    it("should only update specified parts of the scene", async () => {
      await builderService.updateScene({
        content: makeSimpleLexicalContent("tututu"),
        key: "blabla",
      });

      expect(localRepository.updatePartialScene).toHaveBeenCalledWith(
        "blabla",
        {
          content: makeSimpleLexicalContent("tututu"),
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
    it("should not delete when story key is invalid", async () => {
      storyRepository.get = vi.fn(() => Promise.resolve(null));

      await expect(
        builderService.deleteScenes({
          storyKey: "vroum",
          sceneKeys: ["ti", "ta", "tu"],
        }),
      ).rejects.toThrow(EntityNotExistError);
      expect(localRepository.deleteScenes).not.toHaveBeenCalled();
    });

    it("should not delete first scene", async () => {
      storyRepository.get = vi.fn(() =>
        Promise.resolve(factory.story.builder({ firstSceneKey: "ti" })),
      );

      await expect(
        builderService.deleteScenes({
          storyKey: "vroum",
          sceneKeys: ["ti", "ta", "tu"],
        }),
      ).rejects.toThrow(CannotDeleteFirstSceneError);
      expect(localRepository.deleteScenes).not.toHaveBeenCalled();
    });

    it("should delete scenes", async () => {
      await builderService.deleteScenes({
        storyKey: "vroum",
        sceneKeys: ["ti", "ta", "tu"],
      });

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
      const NODES: BuilderNode[] = [
        {
          data: {
            title: "A mysterious crossroads",
            content: makeSimpleLexicalContent(
              "You arrive at a crossroads. On the left, a sinuous dirt path leads to a tree mass. The road on the right is a well-maintained paved trail that runs towards a little village in the hills.",
            ),
            actions: [
              { type: "simple", targets: [], text: "Go to the forest" },
              { type: "simple", targets: [], text: "Go to the village" },
            ],
            isFirstScene: false,
            key: "first-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
            builderParams: { position: { x: 1111, y: 1111 } },
          },
          id: "first-fake-scene-key",
          position: { x: 1111, y: 1111 },
          type: "scene",
        },
        {
          data: {
            title: "The Forest",
            content: makeSimpleLexicalContent(
              "After half an hour of walking under the bright sun, you come close to the trees. As the air gets colder, you start hearing birds and other creatures of the forest",
            ),
            actions: [],
            isFirstScene: false,
            key: "forest-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
            builderParams: { position: { x: 2222, y: 2222 } },
          },
          id: "forest-fake-scene-key",
          position: { x: 2222, y: 2222 },
          type: "scene",
        },
        {
          data: {
            title: "The Road to the Village",
            content: makeSimpleLexicalContent(
              "You walk alongside an - for most of it - even path that leads you under the protecting shadows of the hills. You maintain a quick pace. After a moment, you begin feeling like something is watching you.",
            ),
            actions: [],
            isFirstScene: false,
            key: "village-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
            builderParams: { position: { x: 3333, y: 3333 } },
          },
          id: "village-fake-scene-key",
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
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "forest-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 2222, y: 2222 } },
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "village-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 3333, y: 3333 } },
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
      ];

      localRepository.getScenesByStoryKey.mockResolvedValueOnce(SCENES);

      layoutService.computeAutoLayout.mockResolvedValueOnce([
        {
          data: {
            title: "A mysterious crossroads",
            content: makeSimpleLexicalContent(
              "You arrive at a crossroads. On the left, a sinuous dirt path leads to a tree mass. The road on the right is a well-maintained paved trail that runs towards a little village in the hills.",
            ),
            actions: [
              { type: "simple", targets: [], text: "Go to the forest" },
              { type: "simple", targets: [], text: "Go to the village" },
            ],
            isFirstScene: false,
            key: "first-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
            builderParams: { position: { x: 1, y: 1 } },
          },
          id: "first-fake-scene-key",
          position: { x: 1, y: 1 },
          type: "scene",
        },
        {
          data: {
            title: "The Forest",
            content: makeSimpleLexicalContent(
              "After half an hour of walking under the bright sun, you come close to the trees. As the air gets colder, you start hearing birds and other creatures of the forest",
            ),
            actions: [],
            isFirstScene: false,
            key: "forest-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
            builderParams: { position: { x: 2, y: 2 } },
          },
          id: "forest-fake-scene-key",
          position: { x: 2, y: 2 },
          type: "scene",
        },
        {
          data: {
            title: "The Road to the Village",
            content: makeSimpleLexicalContent(
              "You walk alongside an - for most of it - even path that leads you under the protecting shadows of the hills. You maintain a quick pace. After a moment, you begin feeling like something is watching you.",
            ),
            actions: [],
            isFirstScene: false,
            key: "village-fake-scene-key",
            storyKey: "fake-story-key",
            isEditable: false,
            builderParams: { position: { x: 3, y: 3 } },
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

      expect(result.before).toStrictEqual([
        {
          key: "first-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 1111, y: 1111 } },
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "forest-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 2222, y: 2222 } },
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "village-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 3333, y: 3333 } },
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
      ]);
      expect(result.after).toStrictEqual([
        {
          key: "first-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 1, y: 1 } },
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "forest-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 2, y: 2 } },
          content: makeSimpleLexicalContent("content"),
          storyKey: "fake-story-key",
          title: "title",
        },
        {
          key: "village-fake-scene-key",
          actions: [],
          builderParams: { position: { x: 3, y: 3 } },
          content: makeSimpleLexicalContent("content"),
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

    describe("importFromJSON", () => {
      it("should import story from JSON", async () => {
        const result = await builderService.importStory({
          story: MOCK_IMPORTED_STORY,
          scenes: [MOCK_IMPORTED_SCENE],
        });

        expect(result).toStrictEqual({
          error: null,
          data: { storyKey: BASIC_STORY.key },
        });
      });
    });
  });

  describe("updateStory", () => {
    it("should update scene using repository", async () => {
      const mockStory = factory.story.builder();
      storyRepository.update = vi.fn(() => Promise.resolve(mockStory));

      const story = await builderService.updateStory("schplong", {
        author: { key: "key", username: "bob_bidou" },
        title: "A new title",
      });

      expect(storyRepository.update).toHaveBeenCalledExactlyOnceWith(
        "schplong",
        {
          author: { key: "key", username: "bob_bidou" },
          title: "A new title",
        },
      );

      expect(story).toStrictEqual(mockStory);
    });
  });

  describe("duplicateScenes", () => {
    test("invalid story key", async () => {
      storyRepository.get = vi.fn(() => Promise.resolve(null));

      await expect(
        builderService.duplicateScenes({
          originalScenes: [],
          newPositions: {},
          storyKey: "VROUM",
        }),
      ).rejects.toThrow(EntityNotExistError);
      expect(sceneRepository.bulkAdd).not.toHaveBeenCalled();
    });

    test("missing positions", async () => {
      await expect(
        builderService.duplicateScenes({
          originalScenes: [factory.scene()],
          newPositions: {},
          storyKey: "VROUM",
        }),
      ).rejects.toThrow(DuplicationMissingPositionError);
      expect(sceneRepository.bulkAdd).not.toHaveBeenCalled();
    });

    test("no scenes", async () => {
      const result = await builderService.duplicateScenes({
        originalScenes: [],
        newPositions: {},
        storyKey: "VROUM",
      });
      expect(result).toStrictEqual([]);
    });

    test("one scene", async () => {
      const scene = factory.scene({
        actions: [
          {
            type: "simple",
            text: "action",
            targets: [{ sceneKey: "something", probability: 100 }],
          },
        ],
      });
      sceneRepository.bulkAdd = vi.fn((payload) => {
        const scenePayload = payload[0]!;
        expect(scenePayload.title).toStrictEqual(scene.title);
        expect(scenePayload.content).toStrictEqual(scene.content);
        expect(scenePayload.actions).toStrictEqual([
          { type: "simple", text: "action" },
        ]);
        expect(scenePayload.storyKey).toStrictEqual("VROUM");
        expect(scenePayload.builderParams).toStrictEqual({
          position: { x: -42, y: 42 },
        });
        return Promise.resolve(["key"]);
      });

      await builderService.duplicateScenes({
        originalScenes: [scene],
        newPositions: { [scene.key]: { x: -42, y: 42 } },
        storyKey: "VROUM",
      });
    });

    test("multiple scenes", async () => {
      const scene1 = factory.scene({
        key: "scene-1",
        actions: [
          {
            type: "simple",
            text: "action1",
            targets: [{ sceneKey: "something", probability: 100 }],
          },
        ],
      });
      const scene2 = factory.scene({
        actions: [
          {
            type: "simple",
            text: "action2",
            targets: [{ sceneKey: "scene-1", probability: 100 }],
          },
        ],
      });

      sceneRepository.bulkAdd = vi.fn((payload) => {
        expect(payload).toHaveLength(2);

        const scene1Payload = payload[0]!;
        expect(scene1Payload.title).toStrictEqual(scene1.title);
        expect(scene1Payload.content).toStrictEqual(scene1.content);
        expect(scene1Payload.actions).toStrictEqual([
          { type: "simple", text: "action1" },
        ]);
        expect(scene1Payload.storyKey).toStrictEqual("VROUM");
        expect(scene1Payload.builderParams).toStrictEqual({
          position: { x: -42, y: 42 },
        });

        const scene2Payload = payload[1]!;
        expect(scene2Payload.title).toStrictEqual(scene2.title);
        expect(scene2Payload.content).toStrictEqual(scene2.content);
        expect(scene2Payload.actions).toStrictEqual([
          {
            type: "simple",
            text: "action2",
            sceneKey: (scene1Payload as Scene).key,
          },
        ]);
        expect(scene2Payload.storyKey).toStrictEqual("VROUM");
        expect(scene2Payload.builderParams).toStrictEqual({
          position: { x: 1, y: 2 },
        });
        return Promise.resolve(["key"]);
      });

      await builderService.duplicateScenes({
        originalScenes: [scene1, scene2],
        newPositions: {
          [scene1.key]: { x: -42, y: 42 },
          [scene2.key]: { x: 1, y: 2 },
        },
        storyKey: "VROUM",
      });
    });
  });
});
