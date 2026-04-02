import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { StoryProgress } from "@/lib/storage/domain";

export type ProgressRepositoryPort = {
  get: (progressKey: string) => Promise<StoryProgress | null>;
  update: (
    progressKey: string,
    progress: Partial<StoryProgress>,
  ) => Promise<void>;
};

export const _getDexieProgressRepository = (
  db: DexieDatabase,
): ProgressRepositoryPort => {
  return {
    get: async (progressKey) => {
      return (await db.storyProgresses.get(progressKey)) ?? null;
    },
    update: async (progressKey, progress) => {
      await db.storyProgresses.update(progressKey, progress);
    },
  };
};

export const getDexieProgressRepository = (): ProgressRepositoryPort =>
  _getDexieProgressRepository(db);
