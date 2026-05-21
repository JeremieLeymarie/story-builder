import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs/local-repository-stub";
import { BuilderNode, BuilderEdge } from "@/builder/types";
import {
  getImportExportServiceStub,
  MockImportExportService,
} from "@/services/common/stubs/stub-import-export-service";
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
import { getTestFactory } from "@/lib/testing/factory";
import { EntityNotExistError } from "@/domains/errors";
import {
  ActionTargetNotFound,
  CannotDeleteFirstSceneError,
  DuplicationMissingPositionError,
} from "../errors";
import {
  getStubBuilderSceneRepository,
  MockBuilderSceneRepository,
} from "../stubs/stub-builder-scene-repository";
import { Action, Scene } from "@/lib/storage/domain";
import { sceneToNodeAdapter } from "@/builder/adapters";

const factory = getTestFactory();

describe("builder-service", () => {
  let builderService: ReturnType<typeof _getBuilderService>;
  let localRepository: MockLocalRepository;
  let layoutService: MockLayoutService;
  let importExportService: MockImportExportService;
  let storyRepository: MockBuilderStoryRepository;
  let sceneRepository: MockBuilderSceneRepository;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    layoutService = getStubLayoutService();
    importExportService = getImportExportServiceStub();
    storyRepository = getStubBuilderStoryRepository();
    sceneRepository = getStubBuilderSceneRepository();

    builderService = _getBuilderService({
      localRepository,
      importExportService,
      layoutService,
      storyRepository,
      sceneRepository,
    });
  });

  describe("update scene builder position", () => {
    test("should update node position", async () => {
      await builderService.updateSceneBuilderPosition("tutu", {
        x: 42,
        y: 42,
      });

      expect(sceneRepository.update).toHaveBeenCalledWith("tutu", {
        builderParams: { position: { x: 42, y: 42 } },
      });
    });
  });

  describe("add scene connection", () => {
    test("should do nothing when given invalid action key", async () => {
      sceneRepository.get.mockResolvedValue(BASIC_SCENE);

      await builderService.addSceneConnection({
        sourceSceneKey: BASIC_SCENE.key,
        destinationSceneKey: "dest",
        actionKey: "key-that-does-not-exist",
      });

      expect(sceneRepository.update).toHaveBeenCalledWith(BASIC_SCENE.key, {
        actions: BASIC_SCENE.actions,
      });
    });

    test("should do nothing when target already exists", async () => {
      sceneRepository.get.mockResolvedValue(
        factory.scene({
          key: "vroum",
          actions: [
            {
              key: "action-key",
              type: "simple",
              text: "action",
              targets: [
                { sceneKey: "dest-key", probability: 20 },
                { sceneKey: "other-dest-key", probability: 80 },
              ],
            },
          ],
        }),
      );

      await builderService.addSceneConnection({
        sourceSceneKey: "vroum",
        destinationSceneKey: "dest-key",
        actionKey: "action-key",
      });

      expect(sceneRepository.update).toHaveBeenCalledWith("vroum", {
        actions: [
          {
            key: "action-key",
            type: "simple",
            text: "action",
            targets: [
              { sceneKey: "dest-key", probability: 20 },
              { sceneKey: "other-dest-key", probability: 80 },
            ],
          },
        ],
      });
    });

    test("should add connection at 100% when it's the first one", async () => {
      sceneRepository.get.mockResolvedValue(
        factory.scene({
          key: "scene-key",
          actions: [
            { key: "action-a", type: "simple", text: "action A", targets: [] },
            { key: "action-b", type: "simple", text: "action B", targets: [] },
          ],
        }),
      );

      await builderService.addSceneConnection({
        sourceSceneKey: "scene-key",
        destinationSceneKey: "dest",
        actionKey: "action-a",
      });

      expect(sceneRepository.update).toHaveBeenCalledWith("scene-key", {
        actions: [
          {
            key: "action-a",
            type: "simple",
            text: "action A",
            targets: [{ sceneKey: "dest", probability: 100 }],
          },
          {
            key: "action-b",

            type: "simple",
            text: "action B",
            targets: [],
          },
        ],
      });
    });

    test("should set probability to 0 when adding another edge", async () => {
      sceneRepository.get.mockResolvedValue(
        factory.scene({
          key: "scene-a",
          actions: [
            {
              key: "action-a",
              type: "conditional",
              targets: [{ sceneKey: "dest-a", probability: 100 }],
              text: "action-a",
              condition: {
                sceneKey: "plouf",
                type: "user-did-visit",
              },
            },
            {
              key: "action-b",
              type: "simple",
              targets: [{ sceneKey: "dest-a", probability: 100 }],
              text: "action-b",
            },
          ],
        }),
      );

      await builderService.addSceneConnection({
        sourceSceneKey: "scene-a",
        destinationSceneKey: "dest-b",
        actionKey: "action-a",
      });

      expect(sceneRepository.update).toHaveBeenCalledWith("scene-a", {
        actions: [
          {
            key: "action-a",
            type: "conditional",
            targets: [
              { sceneKey: "dest-a", probability: 100 },
              { sceneKey: "dest-b", probability: 0 },
            ],
            text: "action-a",
            condition: {
              sceneKey: "plouf",
              type: "user-did-visit",
            },
          },
          {
            key: "action-b",
            type: "simple",
            targets: [{ sceneKey: "dest-a", probability: 100 }],
            text: "action-b",
          },
        ],
      });
    });
  });

  describe("get scenes by key", () => {
    test("should get scenes from repo", async () => {
      const scenes = [factory.scene(), factory.scene()];
      const scenesByKey = Object.fromEntries(scenes.map((s) => [s.key, s]));
      sceneRepository.getScenesByKey.mockResolvedValueOnce(scenesByKey);

      const result = await builderService.getScenesByKey(["tutu", "titi"]);

      expect(result).toStrictEqual(scenesByKey);
      expect(sceneRepository.getScenesByKey).toHaveBeenCalledOnce();
      expect(sceneRepository.getScenesByKey).toHaveBeenCalledWith([
        "tutu",
        "titi",
      ]);
    });
  });

  describe("remove scene connections", () => {
    test("should not allow invalid source scene keys", async () => {
      sceneRepository.getScenesByKey.mockResolvedValueOnce({
        "source-exists": factory.scene({ key: "source-exists", actions: [] }),
      });

      await expect(
        builderService.removeSceneConnections([
          {
            actionKey: "action-key-a",
            sourceSceneKey: "source-not-exists", // does
            targetSceneKey: "target-a",
          },
          {
            actionKey: "action-key-b",
            sourceSceneKey: "source-exists",
            targetSceneKey: "target-a",
          },
        ]),
      ).rejects.toThrow(
        new AggregateError([
          new EntityNotExistError("scene", "source-not-exists"),
        ]),
      );
    });

    test("should remove one connection", async () => {
      sceneRepository.getScenesByKey.mockResolvedValue({
        tutu: factory.scene({
          key: "tutu",
          actions: [
            {
              key: "action-key-a",
              type: "simple",
              text: "action A",
              targets: [{ sceneKey: "zut", probability: 100 }],
            },
            {
              key: "action-key-b",
              type: "simple",
              text: "action B",
              targets: [{ sceneKey: "flûte", probability: 100 }],
            },
          ],
        }),
      });
      await builderService.removeSceneConnections([
        {
          sourceSceneKey: "tutu",
          actionKey: "action-key-a",
          targetSceneKey: "zut",
        },
      ]);

      expect(sceneRepository.getScenesByKey).toHaveBeenCalledWith(["tutu"]);
      expect(sceneRepository.update).toHaveBeenCalledWith("tutu", {
        actions: [
          {
            key: "action-key-a",
            type: "simple",
            text: "action A",
            targets: [],
          },
          {
            key: "action-key-b",
            type: "simple",
            text: "action B",
            targets: [{ sceneKey: "flûte", probability: 100 }],
          },
        ],
      });
    });

    test("should remove multiple connections - complex case", async () => {
      const firstScene = factory.scene({
        key: "first-scene-key",
        actions: [
          {
            key: "action-key-a",
            type: "simple",
            text: "action A",
            targets: [
              { sceneKey: "zut", probability: 40 },
              { sceneKey: "crotte", probability: 55 },
              { sceneKey: "fichtre", probability: 5 },
            ],
          },
          {
            key: "action-key-b",
            type: "simple",
            text: "action B",
            targets: [{ sceneKey: "flûte", probability: 100 }],
          },
        ],
      });
      const secondScene = factory.scene({
        key: "second-scene-key",
        actions: [
          {
            key: "scene-2-action-key-a",
            type: "simple",
            text: "action A",
            targets: [{ sceneKey: "diantre", probability: 100 }],
          },
          {
            key: "scene-2-action-key-b",
            type: "simple",
            text: "action B",
            targets: [
              { sceneKey: "sapristi", probability: 30 },
              { sceneKey: "purée", probability: 60 },
              { sceneKey: "cornegidouille", probability: 10 },
            ],
          },
        ],
      });

      sceneRepository.getScenesByKey.mockResolvedValue({
        "first-scene-key": firstScene,
        "second-scene-key": secondScene,
      });

      const updatedScenes = await builderService.removeSceneConnections([
        {
          // first scene - first action - first target
          sourceSceneKey: "first-scene-key",
          actionKey: "action-key-a",
          targetSceneKey: "zut",
        },
        {
          // first scene - first action - third target
          sourceSceneKey: "first-scene-key",
          actionKey: "action-key-a",
          targetSceneKey: "fichtre",
        },
        {
          // first scene - second action - first (and only) target
          sourceSceneKey: "first-scene-key",
          actionKey: "action-key-b",
          targetSceneKey: "flûte",
        },
        {
          // second scene - second action - second target
          sourceSceneKey: "second-scene-key",
          actionKey: "scene-2-action-key-b",
          targetSceneKey: "purée",
        },
      ]);

      expect(sceneRepository.getScenesByKey).toHaveBeenCalledWith([
        "first-scene-key",
        "second-scene-key",
      ]);
      expect(sceneRepository.update).toHaveBeenCalledTimes(2);
      expect(updatedScenes[firstScene.key]?.actions).toStrictEqual([
        {
          key: "action-key-a",
          type: "simple",
          text: "action A",
          targets: [{ sceneKey: "crotte", probability: 100 }], // Probability is set back to 100% since it's the last one
        },
        {
          key: "action-key-b",
          type: "simple",
          text: "action B",
          targets: [],
        },
      ]);
      expect(updatedScenes[secondScene.key]?.actions).toStrictEqual([
        {
          key: "scene-2-action-key-a",
          type: "simple",
          text: "action A",
          targets: [{ sceneKey: "diantre", probability: 100 }],
        },
        {
          key: "scene-2-action-key-b",
          type: "simple",
          text: "action B",
          targets: [
            // middle one deleted and probabilities of the others remain unchanged
            { sceneKey: "sapristi", probability: 30 },
            { sceneKey: "cornegidouille", probability: 10 },
          ],
        },
      ]);
    });
  });

  describe("update target probability", () => {
    test("should fail if target does not exist ", async () => {
      sceneRepository.get.mockResolvedValue(
        factory.scene({
          key: "source-scene-key",
          actions: [
            {
              key: "source-action-key",
              type: "simple",
              targets: [{ sceneKey: "other-target-key", probability: 100 }],
              text: "source action",
            },
          ],
        }),
      );

      await expect(
        builderService.updateTargetProbability({
          sourceSceneKey: "source-scene-key",
          actionKey: "source-action-key",
          targetSceneKey: "target-scene-key",
          probability: 42,
        }),
      ).rejects.toThrowError(ActionTargetNotFound);
    });

    test("should update probability of target", async () => {
      sceneRepository.get.mockResolvedValue(
        factory.scene({
          key: "source-scene-key",
          actions: [
            {
              key: "source-action-key",
              type: "simple",
              targets: [
                { sceneKey: "target-scene-key", probability: 20 },
                { sceneKey: "other-target-key", probability: 100 },
              ],
              text: "source action",
            },
            {
              key: "other-action-key",
              type: "simple",
              targets: [
                { sceneKey: "target-scene-key", probability: 80 },
                { sceneKey: "other-target-key", probability: 20 },
              ],
              text: "other action",
            },
          ],
        }),
      );

      await builderService.updateTargetProbability({
        sourceSceneKey: "source-scene-key",
        actionKey: "source-action-key",
        targetSceneKey: "target-scene-key",
        probability: 42,
      });

      expect(sceneRepository.update).toHaveBeenCalledWith("source-scene-key", {
        actions: [
          {
            key: "source-action-key",
            type: "simple",
            targets: [
              { sceneKey: "target-scene-key", probability: 42 }, // Nothing changed but this line
              { sceneKey: "other-target-key", probability: 100 },
            ],
            text: "source action",
          },
          {
            key: "other-action-key",
            type: "simple",
            targets: [
              { sceneKey: "target-scene-key", probability: 80 },
              { sceneKey: "other-target-key", probability: 20 },
            ],
            text: "other action",
          },
        ],
      });
    });
  });

  describe("check action targets validity", () => {
    const baseAction = {
      key: "zioup",
      type: "simple",
      text: "action",
      targets: [],
    } satisfies Action;

    test("no targets", () => {
      expect(
        builderService.checkActionTargetsValidity(baseAction),
      ).toBeTruthy();
    });

    test("one valid target", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [{ sceneKey: "dest", probability: 100 }],
        }),
      ).toBeTruthy();
    });

    test("simple valid targets", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [
            { sceneKey: "dest-a", probability: 70 },
            { sceneKey: "dest-b", probability: 30 },
          ],
        }),
      ).toBeTruthy();
    });

    test("float valid targets", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [
            { sceneKey: "dest-a", probability: 70.4 },
            { sceneKey: "dest-b", probability: 29.6 },
          ],
        }),
      ).toBeTruthy();
    });

    test("float valid targets with margin of error", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [
            { sceneKey: "dest-a", probability: 70.001 },
            { sceneKey: "dest-b", probability: 30.003 },
            // Total is 100.007, which is sufficiently close to 100
          ],
        }),
      ).toBeTruthy();
    });

    test("one invalid target", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [{ sceneKey: "dest", probability: 99 }],
        }),
      ).toBeFalsy();
    });

    test("invalid targets - higher than 100%", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [
            { sceneKey: "dest-a", probability: 71 },
            { sceneKey: "dest-b", probability: 30 },
          ],
        }),
      ).toBeFalsy();
    });

    test("invalid targets - lower than 100%", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [
            { sceneKey: "dest-a", probability: 69 },
            { sceneKey: "dest-b", probability: 30 },
          ],
        }),
      ).toBeFalsy();
    });

    test("invalid targets - lower than 0%", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [
            { sceneKey: "dest-a", probability: 0 },
            { sceneKey: "dest-b", probability: -42 },
          ],
        }),
      ).toBeFalsy();
    });

    test("invalid targets - floats", () => {
      expect(
        builderService.checkActionTargetsValidity({
          ...baseAction,
          targets: [
            { sceneKey: "dest-a", probability: 70.0 },
            { sceneKey: "dest-b", probability: 30.1 },
          ],
        }),
      ).toBeFalsy();
    });
  });

  describe("create story with first scene", () => {
    test("should create story and first scene", async () => {
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
          updatedAt: new Date(),
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
              key: expect.any(String),
              type: "simple",
              text: "An action that leads to a scene",
              targets: [],
            },
            {
              key: expect.any(String),
              type: "simple",
              text: "An action that leads to another scene",
              targets: [],
            },
          ],
        },
      });
    });

    test("should add author if user is logged in", async () => {
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
          updatedAt: new Date(),
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
              key: expect.any(String),
              type: "simple",
              text: "An action that leads to a scene",
              targets: [],
            },
            {
              key: expect.any(String),
              type: "simple",
              text: "An action that leads to another scene",
              targets: [],
            },
          ],
        },
      });
    });
  });

  describe("add scene", () => {
    test("should add scene to local database", async () => {
      await builderService.addScene(BASIC_SCENE);

      expect(sceneRepository.create).toHaveBeenCalledWith(BASIC_SCENE);
    });
  });

  describe("update scene", () => {
    test("should only update specified parts of the scene", async () => {
      await builderService.updateScene({
        content: makeSimpleLexicalContent("tututu"),
        key: "blabla",
      });

      expect(sceneRepository.update).toHaveBeenCalledWith("blabla", {
        content: makeSimpleLexicalContent("tututu"),
      });
    });
  });

  describe("save side effects", () => {
    test("invalid scene", async () => {
      sceneRepository.get.mockResolvedValueOnce(null);

      await expect(
        builderService.saveSideEffects({
          sceneKey: "invalid",
          sideEffects: [],
        }),
      ).rejects.toThrowError(EntityNotExistError);
    });

    test("with no effects", async () => {
      const scene = factory.scene({
        sideEffects: undefined,
      });
      sceneRepository.get.mockResolvedValueOnce(scene);

      const effect = factory.sideEffect();
      await builderService.saveSideEffects({
        sceneKey: scene.key,
        sideEffects: [effect],
      });

      expect(sceneRepository.update).toHaveBeenCalledWith(scene.key, {
        ...scene,
        sideEffects: [effect],
      });
    });
    test("with existing effects", async () => {
      const [effectToUpdate, effectToDelete, effectToAdd] = [
        factory.sideEffect({ isVisible: true }),
        factory.sideEffect(),
        factory.sideEffect(),
      ];
      const scene = factory.scene({
        sideEffects: [effectToUpdate, effectToDelete],
      });
      sceneRepository.get.mockResolvedValueOnce(scene);

      await builderService.saveSideEffects({
        sceneKey: scene.key,
        sideEffects: [{ ...effectToUpdate, isVisible: false }, effectToAdd],
      });

      expect(sceneRepository.update).toHaveBeenCalledWith(scene.key, {
        ...scene,
        sideEffects: [{ ...effectToUpdate, isVisible: false }, effectToAdd],
      });
    });
  });

  describe("get auto layout", () => {
    test("should return reorganized nodes", async () => {
      const story = factory.story.builder();
      const [sceneA, sceneB, sceneC] = [
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
      ];
      const initialNodes = [sceneA, sceneB].map((scene) =>
        sceneToNodeAdapter({ scene, story }),
      );
      // Mock the layout service response so that the position of each scene is its index in the initial array
      layoutService.computeAutoLayout.mockResolvedValueOnce(
        initialNodes.map((node, i) => ({
          ...node,
          position: {
            x: i,
            y: i,
          },
        })),
      );
      localRepository.getScenesByStoryKey.mockResolvedValueOnce([
        sceneA,
        sceneB,
        sceneC,
      ]);

      const result = await builderService.getAutoLayout({
        nodes: initialNodes,
        edges: [],
        storyKey: story.key,
      });

      expect(result.before).toStrictEqual([sceneA, sceneB, sceneC]);
      expect(result.after).toStrictEqual([
        ...[sceneA, sceneB].map((scene, i) => ({
          ...scene,
          builderParams: {
            position: {
              x: i,
              y: i,
            },
          },
        })),
        sceneC,
      ]);
      expect(layoutService.computeAutoLayout).toHaveBeenCalledWith({
        nodes: initialNodes,
        edges: [],
      });
    });
  });

  describe("change first scene", () => {
    test("should update the first scene of a story", async () => {
      const success = await builderService.changeFirstScene("CANARD", "KADOC");

      expect(sceneRepository.get).toHaveBeenCalledWith("KADOC");
      expect(storyRepository.update).toHaveBeenCalledWith("CANARD", {
        firstSceneKey: "KADOC",
      });

      expect(success).toBeTruthy();
    });

    test("should not update the story if the scene key is invalid", async () => {
      sceneRepository.get.mockResolvedValueOnce(null);

      const success = await builderService.changeFirstScene("CANARD", "KADOC");

      expect(sceneRepository.get).toHaveBeenCalledWith("KADOC");
      expect(storyRepository.update).not.toHaveBeenCalled();

      expect(success).toBeFalsy();
    });
  });

  describe("get builder story data", () => {
    test("should return story data", async () => {
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

  describe("get user builder stories", () => {
    test("should retrieve stories created by logged in user", async () => {
      const newestStory = factory.story.builder({
        key: "newest-story",
        updatedAt: new Date("2025-06-01"),
      });
      const oldestStory = factory.story.builder({
        key: "oldest-story",
        updatedAt: new Date("2025-01-01"),
      });

      localRepository.getStoriesByAuthor.mockResolvedValueOnce([
        oldestStory,
        { ...BASIC_STORY, type: "imported" },
        newestStory,
      ]);
      localRepository.getStoriesByAuthor.mockResolvedValueOnce([
        BASIC_STORY,
        { ...BASIC_STORY, type: "imported" },
      ]);

      const stories = await builderService.getUserBuilderStories();

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledTimes(2);
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledWith(
        BASIC_USER.key,
      );
      expect(localRepository.getStoriesByAuthor).toHaveBeenCalledWith(
        undefined,
      );
      expect(stories).toStrictEqual([BASIC_STORY, newestStory, oldestStory]);
    });
  });

  describe("get full builder state", () => {
    test("should get all stories and scenes", async () => {
      const result = await builderService.getAllBuilderData();

      expect(localRepository.getScenesByStoryKey).toHaveBeenCalled();
      expect(result).toStrictEqual({
        stories: [BASIC_STORY, BASIC_STORY],
        scenes: [BASIC_SCENE],
      });
    });
  });

  describe("load builder state", () => {
    test("should update local database with input data", async () => {
      const currentStories = [factory.story.builder(), factory.story.builder()];
      const currentScenes = [
        factory.scene({ storyKey: currentStories[0]!.key }),
        factory.scene({ storyKey: currentStories[0]!.key }),
      ];
      localRepository.getStoriesByAuthor = vi.fn((author) =>
        author
          ? Promise.resolve([currentStories[1]!])
          : Promise.resolve([currentStories[0]!]),
      );
      localRepository.getScenesByStoryKey.mockResolvedValueOnce(currentScenes);

      const newStories = [factory.story.builder()];
      const newScenes = [
        factory.scene({ storyKey: newStories[0]!.key }),
        factory.scene({ storyKey: newStories[0]!.key }),
      ];

      await builderService.loadBuilderState(newStories, newScenes);

      expect(localRepository.unitOfWork).toHaveBeenCalled();
      expect(localRepository.updateOrCreateStories).toHaveBeenCalledWith(
        newStories,
      );
      expect(localRepository.updateOrCreateScenes).toHaveBeenCalledWith(
        newScenes,
      );
      expect(localRepository.deleteScenes).toHaveBeenCalledWith(
        currentScenes.map((s) => s.key),
      );
      expect(localRepository.deleteStories).toHaveBeenCalledOnce();
    });
  });

  describe("delete scenes", () => {
    test("should not delete when story key is invalid", async () => {
      storyRepository.get = vi.fn(() => Promise.resolve(null));

      await expect(
        builderService.deleteScenes({
          storyKey: "vroum",
          sceneKeys: ["ti", "ta", "tu"],
        }),
      ).rejects.toThrow(EntityNotExistError);
      expect(sceneRepository.delete).not.toHaveBeenCalled();
    });

    test("should not delete first scene", async () => {
      storyRepository.get = vi.fn(() =>
        Promise.resolve(factory.story.builder({ firstSceneKey: "ti" })),
      );

      await expect(
        builderService.deleteScenes({
          storyKey: "vroum",
          sceneKeys: ["ti", "ta", "tu"],
        }),
      ).rejects.toThrow(CannotDeleteFirstSceneError);

      expect(sceneRepository.delete).not.toHaveBeenCalled();
    });

    test("simple case", async () => {
      const result = await builderService.deleteScenes({
        storyKey: "vroum",
        sceneKeys: ["ti", "ta", "tu"],
      });

      expect(result.deletedSceneKeys).toStrictEqual(["ti", "ta", "tu"]);
      expect(result.updatedScenes).toStrictEqual({});
      expect(result.deletedConnections).toStrictEqual([]);
      expect(sceneRepository.delete).toHaveBeenCalledWith(
        ["ti", "ta", "tu"],
        "vroum",
      );
      expect(sceneRepository.delete).toHaveBeenCalledOnce();
    });

    test("update related scenes and delete related connections", async () => {
      // Scene A points to scene B
      const sceneA = factory.scene({
        storyKey: "story-key",
        key: "scene-a",
        actions: [
          {
            key: "action-a",
            text: "Action A",
            type: "simple",
            targets: [{ sceneKey: "scene-b", probability: 100 }],
          },
        ],
      });
      const sceneB = factory.scene({
        storyKey: "story-key",
        key: "scene-b",
      });
      const sceneC = factory.scene({
        storyKey: "story-key",
        key: "scene-c",
      });
      const scenes = [sceneA, sceneB, sceneC];
      localRepository.getScenesByStoryKey.mockResolvedValueOnce(scenes);
      sceneRepository.getScenesByKey = vi.fn((keys) =>
        Promise.resolve(
          Object.fromEntries(
            scenes
              .filter((sc) => keys.includes(sc.key))
              .map((sc) => [sc.key, sc]),
          ),
        ),
      );

      const result = await builderService.deleteScenes({
        storyKey: "story-key",
        sceneKeys: ["scene-b", "scene-c"],
      });

      expect(result.deletedSceneKeys).toStrictEqual(["scene-b", "scene-c"]);
      expect(result.updatedScenes).toStrictEqual({
        "scene-a": {
          ...sceneA,
          actions: [
            {
              key: "action-a",
              text: "Action A",
              type: "simple",
              targets: [], // Target was removed
            },
          ],
        },
      });
      expect(result.deletedConnections).toStrictEqual([
        {
          actionKey: "action-a",
          sourceSceneKey: "scene-a",
          targetSceneKey: "scene-b",
        },
      ]);
      expect(sceneRepository.update).toHaveBeenCalledOnce();
      expect(sceneRepository.update).toHaveBeenCalledWith("scene-a", {
        actions: [
          {
            key: "action-a",
            text: "Action A",
            type: "simple",
            targets: [], // Target was removed
          },
        ],
      });
      expect(sceneRepository.delete).toHaveBeenCalledWith(
        ["scene-b", "scene-c"],
        "story-key",
      );
    });
  });

  describe("delete story", () => {
    test("should delete story", async () => {
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

  describe("compute auto layout", () => {
    test("should compute new positions", async () => {
      const NODES: BuilderNode[] = [
        {
          data: {
            title: "A mysterious crossroads",
            content: makeSimpleLexicalContent(
              "You arrive at a crossroads. On the left, a sinuous dirt path leads to a tree mass. The road on the right is a well-maintained paved trail that runs towards a little village in the hills.",
            ),
            actions: [
              {
                key: "key-1",
                type: "simple",
                targets: [],
                text: "Go to the forest",
              },
              {
                key: "key-2",
                type: "simple",
                targets: [],
                text: "Go to the village",
              },
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

      const EDGES: BuilderEdge[] = [
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
        updatedAt: new Date(),
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
              {
                key: "key-1",
                type: "simple",
                targets: [],
                text: "Go to the forest",
              },
              {
                key: "key-2",
                type: "simple",
                targets: [],
                text: "Go to the village",
              },
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

  describe("bulk update scenes", () => {
    test("should update or create scenes with", async () => {
      await builderService.bulkUpdateScenes({ scenes: [BASIC_SCENE] });

      expect(sceneRepository.bulkUpdate).toHaveBeenCalledOnce();
      expect(sceneRepository.bulkUpdate).toHaveBeenCalledWith([BASIC_SCENE]);
    });
  });

  describe("import story", () => {
    // test("simple case"())

    test("should import story from JSON", async () => {
      const story = factory.story.builder();
      const scenes = [
        factory.scene({ key: "old-key-a" }),
        factory.scene({ key: "old-key-b" }),
      ];
      const characterConfig = factory.characterConfig();
      const theme = factory.storyTheme();
      const _wiki = factory.wiki();
      const wiki = { ..._wiki, description: _wiki.description ?? "" };
      const wikiArticles = [factory.wikiArticle({ wikiKey: wiki.key })];
      const wikiCategories = [factory.wikiCategory({ wikiKey: wiki.key })];
      const wikiArticleLinks = [
        factory.wikiArticleLink({ articleKey: wikiArticles[0]!.key }),
      ];

      const newStory = factory.story.builder();
      importExportService.createStory.mockResolvedValue({ data: newStory });
      importExportService.createScenes.mockResolvedValueOnce({
        "old-key-a": "new-key-a",
        "old-key-b": "new-key-b",
      });

      const result = await builderService.importStory({
        story,
        scenes,
        characterConfig,
        theme: theme.theme,
        wiki: {
          wiki,
          articles: wikiArticles,
          categories: wikiCategories,
          articleLinks: wikiArticleLinks,
        },
      });

      expect(importExportService.createCharacterConfig).toHaveBeenCalledWith({
        newStoryKey: newStory.key,
        characterConfig,
      });
      expect(importExportService.createTheme).toHaveBeenCalledWith({
        newStoryKey: newStory.key,
        theme: theme.theme,
      });
      expect(importExportService.createWiki).toHaveBeenCalledWith({
        oldScenesToNew: {
          "old-key-a": "new-key-a",
          "old-key-b": "new-key-b",
        },
        type: "created",
        wikiData: {
          wiki,
          articles: wikiArticles,
          categories: wikiCategories,
          articleLinks: wikiArticleLinks,
        },
        newStoryKey: newStory.key,
      });
      expect(result).toStrictEqual(newStory.key);
    });
  });

  describe("update story", () => {
    test("should update scene using repository", async () => {
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

  describe("duplicate scenes", () => {
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
            key: "action-key",
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
          { key: "action-key", type: "simple", text: "action", targets: [] },
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
            key: "action-key-1",
            type: "simple",
            text: "action1",
            targets: [{ sceneKey: "something", probability: 100 }],
          },
        ],
      });
      const scene2 = factory.scene({
        actions: [
          {
            key: "action-key-2",
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
          { key: "action-key-1", type: "simple", text: "action1", targets: [] },
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
            key: "action-key-2",
            type: "simple",
            text: "action2",
            targets: [
              { sceneKey: (scene1Payload as Scene).key, probability: 100 },
            ],
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

  describe("make empty action payload", () => {
    test("returns simple empty action ", () => {
      expect(builderService.makeEmptyActionPayload()).toStrictEqual({
        key: expect.any(String),
        type: "simple",
        text: "",
        targets: [],
      });
    });
  });

  describe("make empty side effect payload", () => {
    test("throw hen character is not properly set up", () => {
      expect(() =>
        builderService.makeEmptySideEffectPayload({
          characterConfig: {
            key: "config-key",
            storyKey: "story-key",
            attributes: {}, // No attributes
          },
        }),
      ).toThrow(
        new Error(
          "Cannot create side effect payload when character configuration has no attributes.",
        ),
      );
    });

    test("returns basic side effect", () => {
      const attr1 = factory.characterConfigAttribute({ name: "dexterity" });
      const attr2 = factory.characterConfigAttribute({ name: "charisma" });

      const sideEffect = builderService.makeEmptySideEffectPayload({
        characterConfig: {
          key: "config-key",
          storyKey: "story-key",
          attributes: {
            [attr1.key]: attr1,
            [attr2.key]: attr2,
          },
        },
      });
      if (sideEffect.effect.attributeKey === attr1.key)
        expect(sideEffect.name).toStrictEqual("Level-up Dexterity");
      else expect(sideEffect.name).toStrictEqual("Level-up Charisma");

      expect(sideEffect.isVisible).toBeTruthy();
      expect(sideEffect.trigger).toStrictEqual("scene-load");
      expect(sideEffect.effect.type).toStrictEqual("character-attribute");
      expect(sideEffect.effect.increment).toStrictEqual(1);
      expect(sideEffect.effect.attributeKey).toBeOneOf([attr1.key, attr2.key]);
    });
  });
});
