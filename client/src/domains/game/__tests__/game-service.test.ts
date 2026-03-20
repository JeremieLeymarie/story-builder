import { beforeAll, beforeEach, describe, expect, it, test, vi } from "vitest";
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
} from "../../../repositories/stubs/data";
import { getTestFactory } from "@/lib/testing/factory";
import { nanoid } from "nanoid";
import { randomInArray } from "@/lib/random";

const factory = getTestFactory();

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
      await gameService.saveProgress(BASIC_STORY_PROGRESS.key, {
        currentSceneKey: "tutu",
        sceneActions: [
          { key: "action-key", type: "simple", targets: [], text: "bzz bzz" },
        ],
      });

      expect(localRepository.getStoryProgress).toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.key,
      );
      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "tutu",
        history: [...BASIC_STORY_PROGRESS.history, "tutu"],
        lastPlayedAt: new Date(),
        createdAt: BASIC_STORY_PROGRESS.createdAt,
        userKey: BASIC_USER.key,
      });
    });

    it("should also work when the user is not logged in", async () => {
      localRepository.getUser.mockResolvedValueOnce(null);

      await gameService.saveProgress(BASIC_STORY_PROGRESS.key, {
        currentSceneKey: "tutu",
        sceneActions: [
          { key: "action-key", type: "simple", targets: [], text: "bzz bzz" },
        ],
      });

      expect(localRepository.getStoryProgress).toHaveBeenCalled();
      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "tutu",
        history: [...BASIC_STORY_PROGRESS.history, "tutu"],
        lastPlayedAt: new Date(),
        createdAt: BASIC_STORY_PROGRESS.createdAt,
        userKey: undefined,
      });
    });

    it("should not add to history the same key twice in a row", async () => {
      await gameService.saveProgress(BASIC_STORY_PROGRESS.key, {
        currentSceneKey: BASIC_STORY_PROGRESS.history.at(-1)!,
        sceneActions: [
          { key: "action-key", type: "simple", targets: [], text: "bzz bzz" },
        ],
      });

      expect(localRepository.getStoryProgress).toHaveBeenCalled();
      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        lastPlayedAt: new Date(),
        createdAt: BASIC_STORY_PROGRESS.createdAt,
      });
    });

    it("should keep revisits in history when they are not consecutive", async () => {
      const existingProgress = {
        ...BASIC_STORY_PROGRESS,
        history: ["scene-a", "scene-b"],
        currentSceneKey: "scene-b",
      };
      localRepository.getStoryProgress.mockResolvedValue(existingProgress);

      await gameService.saveProgress(BASIC_STORY_PROGRESS.key, {
        currentSceneKey: "scene-a",
        sceneActions: [
          { key: "action-key", type: "simple", targets: [], text: "bzz bzz" },
        ],
      });

      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...existingProgress,
        currentSceneKey: "scene-a",
        history: ["scene-a", "scene-b", "scene-a"],
        lastPlayedAt: new Date(),
        userKey: BASIC_USER.key,
      });
    });

    it("should mark as finished if the story ends on this scene", async () => {
      await gameService.saveProgress(BASIC_STORY_PROGRESS.key, {
        currentSceneKey: "bim",
        sceneActions: [],
      });

      expect(localRepository.getStoryProgress).toHaveBeenCalled();
      expect(localRepository.updateStoryProgress).toHaveBeenCalledWith({
        ...BASIC_STORY_PROGRESS,
        currentSceneKey: "bim",
        history: [...BASIC_STORY_PROGRESS.history, "bim"],
        lastPlayedAt: new Date(),
        createdAt: BASIC_STORY_PROGRESS.createdAt,
        userKey: BASIC_USER.key,
        finished: true,
      });
    });
  });

  describe("getActionVisibility", () => {
    test("simple actions are always visible", () => {
      const isVisible = gameService.getActionVisibility({
        action: { key: "key", type: "simple", targets: [], text: "tutu" },
        progress: factory.storyProgress({ history: [] }),
      });

      expect(isVisible).toBe(true);
    });

    test("simple actions are always visible in test mode", () => {
      const isVisible = gameService.getActionVisibility({
        action: { key: "key", type: "simple", targets: [], text: "tutu" },
        progress: null,
      });

      expect(isVisible).toBe(true);
    });

    test("conditional actions are never visible in test mode", () => {
      const isVisible = gameService.getActionVisibility({
        action: {
          key: "key",
          type: "conditional",
          targets: [],
          text: "tutu",
          condition: { type: "user-did-not-visit", sceneKey: "" },
        },
        progress: null,
      });

      expect(isVisible).toBe(false);
    });

    describe("[user-did-visit] conditional actions", () => {
      test("page was not visited", () => {
        const isVisibleEmptyHistory = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: { type: "user-did-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [] }),
        });

        expect(isVisibleEmptyHistory).toBe(false);

        const isVisibleFullHistory = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: { type: "user-did-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [nanoid(), nanoid()] }),
        });

        expect(isVisibleFullHistory).toBe(false);
      });

      test("page was visited", () => {
        const isVisible = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: { type: "user-did-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({
            history: [nanoid(), "fake-key", nanoid()],
          }),
        });

        expect(isVisible).toBe(true);
      });
    });

    describe("[user-did-not-visit] conditional actions", () => {
      test("page was visited", () => {
        const isVisible = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: { type: "user-did-not-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({
            history: [nanoid(), "fake-key", nanoid()],
          }),
        });

        expect(isVisible).toBe(false);
      });

      test("page was not visited", () => {
        const isVisibleEmptyHistory = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: { type: "user-did-not-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [] }),
        });

        expect(isVisibleEmptyHistory).toBe(true);

        const isVisibleFullHistory = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: { type: "user-did-not-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [nanoid(), nanoid()] }),
        });

        expect(isVisibleFullHistory).toBe(true);
      });
    });

    describe("[character-attribute]", () => {
      test("character is not configured", () => {
        const isVisible = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: {
              type: "character-attribute",
              attributeKey: "plouf",
              comparator: "greater-than",
              value: 10,
            },
          },
          progress: factory.storyProgress({ character: undefined }),
        });

        expect(isVisible).toBe(true);
      });
      test("attribute does not exist", () => {
        const isVisible = gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: {
              type: "character-attribute",
              attributeKey: "plouf",
              comparator: "greater-than",
              value: 10,
            },
          },
          progress: factory.storyProgress({
            character: factory.progressCharacter(),
          }),
        });

        expect(isVisible).toBe(true);
      });

      const _runTestCondition = ({
        condValue,
        actualValue,
        comparator,
      }: {
        condValue: number;
        actualValue: number;
        comparator: "lower-than" | "greater-than";
      }) => {
        const character = factory.progressCharacter();
        const attr = randomInArray(Object.values(character.attributes));
        character.attributes[attr.key]!.value = actualValue;
        return gameService.getActionVisibility({
          action: {
            key: "key",
            type: "conditional",
            targets: [],
            text: "tutu",
            condition: {
              type: "character-attribute",
              attributeKey: attr.key,
              comparator,
              value: condValue,
            },
          },
          progress: factory.storyProgress({ character }),
        });
      };

      test("attribute is strictly lower than 10", () => {
        // Lower than condition
        expect(
          _runTestCondition({
            condValue: 10,
            actualValue: 9,
            comparator: "lower-than",
          }),
        ).toBe(true);

        // Exactly condition
        expect(
          _runTestCondition({
            condValue: 10,
            actualValue: 10,
            comparator: "lower-than",
          }),
        ).toBe(false);

        // Higher than condition
        expect(
          _runTestCondition({
            condValue: 10,
            actualValue: 11,
            comparator: "lower-than",
          }),
        ).toBe(false);
      });

      test("attribute is strictly lower than -10", () => {
        // Lower than condition
        expect(
          _runTestCondition({
            condValue: -10,
            actualValue: -11,
            comparator: "lower-than",
          }),
        ).toBe(true);

        // Exactly condition
        expect(
          _runTestCondition({
            condValue: -10,
            actualValue: -10,
            comparator: "lower-than",
          }),
        ).toBe(false);

        // Higher than condition
        expect(
          _runTestCondition({
            condValue: -10,
            actualValue: -9,
            comparator: "lower-than",
          }),
        ).toBe(false);
      });

      test("attribute is strictly higher than 10", () => {
        // Higher than condition
        expect(
          _runTestCondition({
            condValue: 10,
            actualValue: 11,
            comparator: "greater-than",
          }),
        ).toBe(true);

        // Exactly condition
        expect(
          _runTestCondition({
            condValue: 10,
            actualValue: 10,
            comparator: "greater-than",
          }),
        ).toBe(false);

        // Lower than condition
        expect(
          _runTestCondition({
            condValue: 10,
            actualValue: 9,
            comparator: "greater-than",
          }),
        ).toBe(false);
      });

      test("attribute is strictly higher than -10", () => {
        // Higher than condition
        expect(
          _runTestCondition({
            condValue: -10,
            actualValue: -9,
            comparator: "greater-than",
          }),
        ).toBe(true);

        // Exactly condition
        expect(
          _runTestCondition({
            condValue: -10,
            actualValue: -10,
            comparator: "greater-than",
          }),
        ).toBe(false);

        // Lower than condition
        expect(
          _runTestCondition({
            condValue: -10,
            actualValue: -11,
            comparator: "greater-than",
          }),
        ).toBe(false);
      });
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

      expect(localRepository.getStoryProgress).toHaveBeenCalledWith(
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
  });
});
