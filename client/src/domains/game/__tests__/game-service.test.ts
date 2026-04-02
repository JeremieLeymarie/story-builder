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
import {
  getStubProgressRepository,
  MockProgressRepository,
} from "../stubs/progress-repository-stub";
import { ProgressCharacter } from "@/lib/storage/domain";

const factory = getTestFactory();

describe("game-service", () => {
  let gameService: ReturnType<typeof _getGameService>;
  let localRepository: MockLocalRepository;
  let progressRepo: MockProgressRepository;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date());
  });

  beforeEach(async () => {
    localRepository = getLocalRepositoryStub();
    progressRepo = getStubProgressRepository();

    gameService = _getGameService({
      localRepository,
      progressRepo,
    });
  });

  describe("saveProgress", () => {
    it("should save the story progress in the local database", async () => {
      progressRepo.get.mockResolvedValue(BASIC_STORY_PROGRESS);
      await gameService.saveProgress(
        BASIC_STORY_PROGRESS.key,
        factory.scene({
          key: "tutu",
          actions: [
            {
              key: "action-key",
              type: "simple",
              targets: [],
              text: "bzz bzz",
            },
          ],
          sideEffects: [],
        }),
      );

      expect(progressRepo.get).toHaveBeenCalledWith(BASIC_STORY_PROGRESS.key);
      expect(localRepository.getUser).toHaveBeenCalled();
      expect(progressRepo.update).toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.key,
        {
          currentSceneKey: "tutu",
          history: [...BASIC_STORY_PROGRESS.history, "tutu"],
          lastPlayedAt: new Date(),
          userKey: BASIC_USER.key,
        },
      );
    });

    it("should also work when the user is not logged in", async () => {
      localRepository.getUser.mockResolvedValueOnce(null);
      progressRepo.get.mockResolvedValueOnce(BASIC_STORY_PROGRESS);

      await gameService.saveProgress(
        BASIC_STORY_PROGRESS.key,
        factory.scene({
          key: "tutu",
          actions: [
            { key: "action-key", type: "simple", targets: [], text: "bzz bzz" },
          ],
          sideEffects: [],
        }),
      );

      expect(progressRepo.get).toHaveBeenCalled();
      expect(localRepository.getUser).toHaveBeenCalled();
      expect(progressRepo.update).toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.key,
        {
          currentSceneKey: "tutu",
          history: [...BASIC_STORY_PROGRESS.history, "tutu"],
          lastPlayedAt: new Date(),
          userKey: undefined,
        },
      );
    });

    it("should not add to history the same key twice in a row", async () => {
      progressRepo.get.mockResolvedValueOnce(BASIC_STORY_PROGRESS);
      await gameService.saveProgress(
        BASIC_STORY_PROGRESS.key,
        factory.scene({
          key: BASIC_STORY_PROGRESS.history.at(-1)!,
          actions: [
            { key: "action-key", type: "simple", targets: [], text: "bzz bzz" },
          ],
        }),
      );

      expect(progressRepo.get).toHaveBeenCalled();
      expect(progressRepo.update).toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.key,
        { lastPlayedAt: new Date(), userKey: expect.any(String) },
      );
    });

    it("should keep revisits in history when they are not consecutive", async () => {
      const existingProgress = {
        ...BASIC_STORY_PROGRESS,
        history: ["scene-a", "scene-b"],
        currentSceneKey: "scene-b",
      };
      progressRepo.get.mockResolvedValue(existingProgress);

      await gameService.saveProgress(
        BASIC_STORY_PROGRESS.key,
        factory.scene({
          key: "scene-a",
          actions: [
            { key: "action-key", type: "simple", targets: [], text: "bzz bzz" },
          ],
          sideEffects: [],
        }),
      );

      expect(progressRepo.update).toHaveBeenCalledWith(existingProgress.key, {
        currentSceneKey: "scene-a",
        history: ["scene-a", "scene-b", "scene-a"],
        lastPlayedAt: new Date(),
        userKey: BASIC_USER.key,
      });
    });

    it("should mark as finished if the story ends on this scene", async () => {
      progressRepo.get.mockResolvedValueOnce(BASIC_STORY_PROGRESS);
      await gameService.saveProgress(
        BASIC_STORY_PROGRESS.key,
        factory.scene({
          key: "bim",
          actions: [],
          sideEffects: [],
        }),
      );

      expect(progressRepo.get).toHaveBeenCalled();
      expect(progressRepo.update).toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.key,
        {
          currentSceneKey: "bim",
          history: [...BASIC_STORY_PROGRESS.history, "bim"],
          lastPlayedAt: new Date(),
          userKey: expect.any(String),
          finished: true,
        },
      );
    });

    describe("side effects", () => {
      const PROGRESS_CHARACTER = {
        attributes: {
          "dex-key": {
            key: "dex-key",
            initialValue: 10,
            name: "dexterity",
            type: "numeric",
            visibility: "invisible",
            value: 10,
          },
        },
      } satisfies ProgressCharacter;

      const _setUpSideEffects = () => {
        const effect = factory.sideEffect({
          effect: {
            attributeKey: "dex-key",
            increment: 5,
            type: "character-attribute",
          },
        });

        const scene = factory.scene({ sideEffects: [effect] });

        return { progressCharacter: PROGRESS_CHARACTER, scene };
      };

      it("should fail when character does not exist", async () => {
        const { scene } = _setUpSideEffects();
        const progress = factory.storyProgress({
          key: "tutu",
          character: undefined, // No character on progress
          currentSceneKey: "scene-2",
          history: ["scene-1", "scene-2"],
        });
        progressRepo.get.mockResolvedValue(progress);

        await expect(
          gameService.saveProgress(progress.key, scene),
        ).rejects.toThrowError();
        expect(progressRepo.update).not.toHaveBeenCalled();
      });

      it("should fail when character attribute does not exist", async () => {
        const { scene } = _setUpSideEffects();
        const progress = factory.storyProgress({
          key: "tutu",
          character: factory.progressCharacter(), // New random character, so that the scene's side effects won't match the character attributes
          currentSceneKey: "scene-2",
          history: ["scene-1", "scene-2"],
        });
        progressRepo.get.mockResolvedValue(progress);

        await expect(
          gameService.saveProgress(progress.key, scene),
        ).rejects.toThrowError();
        expect(progressRepo.update).not.toHaveBeenCalled();
      });

      it("should not trigger side effects when revisiting the same scene consecutively", async () => {
        const { progressCharacter, scene } = _setUpSideEffects();
        const progress = factory.storyProgress({
          key: "tutu",
          character: progressCharacter,
          currentSceneKey: scene.key,
          history: ["scene-1", "scene-2", scene.key],
        });
        progressRepo.get.mockResolvedValue(progress);

        await gameService.saveProgress("tutu", scene);

        expect(progressRepo.update).toHaveBeenCalledOnce();
        expect(progressRepo.update).toHaveBeenCalledWith("tutu", {
          // Nothing is updated except for the date
          lastPlayedAt: new Date(),
          userKey: expect.any(String),
        });
      });

      it("should update character with ", async () => {
        const { progressCharacter, scene } = _setUpSideEffects();
        const progress = factory.storyProgress({
          key: "tutu",
          character: progressCharacter,
          currentSceneKey: "scene-2",
          history: ["scene-1", "scene-2"],
        });
        progressRepo.get.mockResolvedValue(progress);

        await gameService.saveProgress("tutu", scene);

        expect(progressRepo.update).toHaveBeenCalledOnce();
        expect(progressRepo.update).toHaveBeenCalledWith("tutu", {
          currentSceneKey: scene.key,
          history: ["scene-1", "scene-2", scene.key],
          lastPlayedAt: new Date(),
          userKey: expect.any(String),
          character: {
            attributes: {
              "dex-key": {
                key: "dex-key",
                initialValue: 10,
                name: "dexterity",
                type: "numeric",
                visibility: "invisible",
                value: 15, // 10 + 5
              },
            },
          },
        });
      });
    });
  });
  it("should not trigger side effects when revisiting the same scene consecutively", () => {});

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

      gameService = _getGameService({ localRepository, progressRepo });

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
      progressRepo.get.mockResolvedValueOnce(BASIC_STORY_PROGRESS);

      const p = await gameService.getStoryProgress("viooooooum");

      expect(progressRepo.get).toHaveBeenCalledWith("viooooooum");

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
