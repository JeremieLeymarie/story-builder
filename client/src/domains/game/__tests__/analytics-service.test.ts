import { beforeAll, describe, expect, test } from "vitest";
import {
  getStubGameRepository,
  MockGameRepository,
} from "../stubs/game-repository-stub";
import {
  getStubProgressRepository,
  MockProgressRepository,
} from "../stubs/progress-repository-stub";
import { _getAnalyticsService } from "../analytics-service";
import { getTestFactory } from "@/lib/testing/factory";

const factory = getTestFactory();

const _makeScenes = (num: number = 10) =>
  Array(num)
    .fill(null)
    .map(() => factory.scene());

describe("analytics-service", () => {
  let gameRepository: MockGameRepository;
  let progressRepository: MockProgressRepository;

  beforeAll(() => {
    gameRepository = getStubGameRepository();
    progressRepository = getStubProgressRepository();
  });

  const _getSvc = async () => {
    return await _getAnalyticsService({
      gameRepository,
      progressRepository,
      gameKey: "tutu",
      progressKey: "toto",
    });
  };

  describe("getTotalPlayTimeMs", () => {
    test("sums total play time across saves", async () => {
      progressRepository.get.mockResolvedValueOnce(factory.storyProgress());
      gameRepository.getScenes.mockResolvedValueOnce([]);
      const svc = await _getSvc();
      const saves = [
        factory.storyProgress({ totalPlayTimeMs: 1_000 }),
        factory.storyProgress({ totalPlayTimeMs: 2_000 }),
        factory.storyProgress({ totalPlayTimeMs: 3_000 }),
      ];

      expect(svc.getTotalPlayTimeMs(saves)).toBe(6_000);
    });

    test("returns zero when there are no saves", async () => {
      progressRepository.get.mockResolvedValueOnce(factory.storyProgress());
      gameRepository.getScenes.mockResolvedValueOnce([]);
      const svc = await _getSvc();

      expect(svc.getTotalPlayTimeMs([])).toBe(0);
    });

    test("ignores invalid total play time values", async () => {
      progressRepository.get.mockResolvedValueOnce(factory.storyProgress());
      gameRepository.getScenes.mockResolvedValueOnce([]);
      const svc = await _getSvc();
      const saves = [
        { totalPlayTimeMs: 1_000 },
        {},
        { totalPlayTimeMs: Number.NaN },
        { totalPlayTimeMs: 2_000 },
      ];

      expect(svc.getTotalPlayTimeMs(saves)).toBe(3_000);
    });
  });

  describe("getVisitedScenesChart", () => {
    const _test = async ({
      expectedVisited,
      expectedUnvisited,
      expectedRate,
    }: {
      expectedVisited: number;
      expectedUnvisited: number;
      expectedRate: number;
    }) => {
      const svc = await _getSvc();
      const { config, data, rate } = svc.getVisitedScenesChart();

      data.forEach((datum) => {
        expect(Object.keys(config)).toContain(datum.type);
      });
      expect(data[0]).toMatchObject({
        type: "visited",
        count: expectedVisited,
      });
      expect(data[1]).toMatchObject({
        type: "unvisited",
        count: expectedUnvisited,
      });
      expect(rate).toStrictEqual(expectedRate);
    };

    test("0 scenes", async () => {
      progressRepository.get.mockResolvedValueOnce(
        factory.storyProgress({ history: [] }),
      );
      gameRepository.getScenes.mockResolvedValueOnce([]);

      await _test({
        expectedRate: 0,
        expectedUnvisited: 0,
        expectedVisited: 0,
      });
    });

    test("0 visited scenes", async () => {
      const scenes = _makeScenes(10);
      progressRepository.get.mockResolvedValueOnce(
        factory.storyProgress({ history: [] }),
      );
      gameRepository.getScenes.mockResolvedValueOnce(scenes);

      await _test({
        expectedRate: 0,
        expectedUnvisited: 10,
        expectedVisited: 0,
      });
    });

    test("100% visited scenes", async () => {
      const scenes = _makeScenes(10);
      progressRepository.get.mockResolvedValueOnce(
        factory.storyProgress({ history: scenes.map(({ key }) => key) }),
      );
      gameRepository.getScenes.mockResolvedValueOnce(scenes);

      await _test({
        expectedRate: 100,
        expectedUnvisited: 0,
        expectedVisited: 10,
      });
    });

    test("normal situation", async () => {
      const scenes = _makeScenes(9);
      progressRepository.get.mockResolvedValueOnce(
        factory.storyProgress({
          history: [scenes[0]!.key, scenes[4]!.key, scenes[8]!.key],
        }),
      );
      gameRepository.getScenes.mockResolvedValueOnce(scenes);

      await _test({
        expectedRate: 33.33,
        expectedUnvisited: 6,
        expectedVisited: 3,
      });
    });
  });

  describe("isSceneVisited", () => {
    const _isSceneVisited = async ({
      sceneKey,
      mockHistory,
    }: {
      sceneKey: string;
      mockHistory: string[];
    }) => {
      progressRepository.get.mockResolvedValueOnce(
        factory.storyProgress({ history: mockHistory }),
      );
      const svc = await _getSvc();
      return svc.isSceneVisited(sceneKey);
    };

    test("empty history", async () => {
      expect(
        await _isSceneVisited({
          sceneKey: "tutu",
          mockHistory: [],
        }),
      ).toBeFalsy();
    });
    test("scene is not present", async () => {
      expect(
        await _isSceneVisited({
          sceneKey: "tutu",
          mockHistory: ["a", "b", "c"],
        }),
      ).toBeFalsy();
    });
    test("scene is present", async () => {
      expect(
        await _isSceneVisited({
          sceneKey: "tutu",
          mockHistory: ["a", "b", "tutu", "c"],
        }),
      ).toBeTruthy();
    });
    test("scene is present multiple times in history", async () => {
      expect(
        await _isSceneVisited({
          sceneKey: "tutu",
          mockHistory: ["a", "tutu", "b", "tutu"],
        }),
      ).toBeTruthy();
    });
  });

  describe("getAllScenes", () => {
    test("no scenes", async () => {
      progressRepository.get.mockResolvedValueOnce(factory.storyProgress());
      gameRepository.getScenes.mockResolvedValueOnce([]);
      const svc = await _getSvc();
      expect(svc.getAllScenes()).toStrictEqual([]);
    });

    test("simple", async () => {
      progressRepository.get.mockResolvedValueOnce(factory.storyProgress());
      const scenes = _makeScenes();
      gameRepository.getScenes.mockResolvedValueOnce(scenes);
      const svc = await _getSvc();
      expect(svc.getAllScenes()).toStrictEqual(scenes);
    });
  });
});
