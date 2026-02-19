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

  describe("getVisitedScenesChart", () => {
    const _makeScenes = (num: number = 10) =>
      Array(num)
        .fill(null)
        .map(() => factory.scene());

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
});
