import { ChartConfig } from "@/design-system/primitives/chart";
import { GameRepositoryPort, getDexieGameRepository } from "./game-repository";
import {
  getDexieProgressRepository,
  ProgressRepositoryPort,
} from "./progress-repository";
import { round } from "@/lib/number";
import { Scene, StoryProgress } from "@/lib/storage/domain";
import { EntityNotExistError } from "../errors";

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

export type AnalyticsServicePort = {
  getVisitedScenesChart: () => {
    data: VisitedScenesData;
    config: ChartConfig;
    rate: number;
  };
  getProgressRate: (history: string[]) => number;
  getTotalPlayTimeMs: (
    saves: Array<Partial<Pick<StoryProgress, "totalPlayTimeMs">>>,
  ) => number;
  isSceneVisited: (sceneKey: string) => boolean;
  getAllScenes: () => Scene[];
};

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

  if (!progress) throw new EntityNotExistError("story-progress", progressKey);

  const getProgressRate = (history: string[]) =>
    scenes.length > 0
      ? round(
          (scenes.filter((s) => history.includes(s.key)).length /
            scenes.length) *
            100,
        )
      : 0;

  return {
    getProgressRate,

    getTotalPlayTimeMs: (saves) =>
      saves.reduce((acc, save) => {
        const totalPlayTimeMs = save.totalPlayTimeMs;
        const safeTotalPlayTimeMs =
          typeof totalPlayTimeMs === "number" &&
          Number.isFinite(totalPlayTimeMs)
            ? totalPlayTimeMs
            : 0;

        return acc + safeTotalPlayTimeMs;
      }, 0),

    getVisitedScenesChart: () => {
      const initialData = [
        { type: "visited", count: 0, fill: "var(--color-visited)" },
        { type: "unvisited", count: 0, fill: "var(--color-unvisited)" },
      ] satisfies VisitedScenesData;

      const visitedIdx = 0;
      const unvisitedIdx = 1;

      const data = scenes.reduce<VisitedScenesData>((acc, scene) => {
        if (progress.history.includes(scene.key)) acc[visitedIdx].count++;
        else acc[unvisitedIdx].count++;

        return acc;
      }, initialData);

      const rate = getProgressRate(progress.history);

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

    isSceneVisited: (sceneKey) => progress.history.includes(sceneKey),

    getAllScenes: () => scenes,
  };
};

/**
 * Asynchronously construct a service to synchronously get detailed analytics about a specific story progress
 */
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
