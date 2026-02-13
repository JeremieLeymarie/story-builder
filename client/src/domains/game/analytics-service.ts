import { ChartConfig } from "@/design-system/primitives/chart";
import { GameRepositoryPort, getDexieGameRepository } from "./game-repository";
import {
  getDexieProgressRepository,
  ProgressRepositoryPort,
} from "./progress-repository";
import { round } from "@/lib/number";

export type VisitedScenesData = [
  {
    type: "visited";
    count: number;
    fill: string;
  },
  {
    type: "unvisited";
    count: number;
    fill: string;
  },
];

type AnalyticsServicePort = {
  getVisitedScenesChart: () => {
    data: VisitedScenesData;
    config: ChartConfig;
    rate: number;
  };
};

// TODO: test this
export const _getAnalyticsService = async ({
  progressKey,
  gameKey,
  gameRepository,
  progressRepository,
}: {
  progressKey: string;
  gameKey: string;
  gameRepository: GameRepositoryPort;
  progressRepository: ProgressRepositoryPort;
}): Promise<AnalyticsServicePort> => {
  const [progress, scenes] = await Promise.all([
    progressRepository.get(progressKey),
    gameRepository.getScenes(gameKey),
  ]);

  return {
    getVisitedScenesChart: () => {
      const initialData = [
        { type: "visited", count: 0, fill: "var(--color-visited)" },
        { type: "unvisited", count: 0, fill: "var(--color-unvisited)" },
      ] satisfies VisitedScenesData;

      const visitedIdx = 0;
      const unvisitedIdx = 1;

      const data = scenes.reduce<VisitedScenesData>((acc, scene) => {
        if (progress?.history.includes(scene.key)) acc[visitedIdx].count++;
        else acc[unvisitedIdx].count++;

        return acc;
      }, initialData);

      const rate = round((data[visitedIdx].count / scenes.length) * 100, 2);

      return {
        data,
        rate,
        config: {
          count: {
            label: "Number of scenes",
          },
          visited: {
            label: "Visited",
            color: "var(--chart-1)",
          },
          unvisited: {
            label: "Not visited",
            color: "var(--chart-2)",
          },
        } satisfies ChartConfig,
      };
    },
  };
};

export const makeAnalyticsService = async ({
  progressKey,
  gameKey,
}: {
  progressKey: string;
  gameKey: string;
}) => {
  return _getAnalyticsService({
    progressKey,
    gameKey,
    gameRepository: getDexieGameRepository(),
    progressRepository: getDexieProgressRepository(),
  });
};
