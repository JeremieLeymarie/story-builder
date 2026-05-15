import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { StoryProgress } from "@/lib/storage/domain";

export type ProgressRepositoryPort = {
  get: (progressKey: string) => Promise<StoryProgress | null>;
};

export const _getDexieProgressRepository = (
  db: DexieDatabase,
): ProgressRepositoryPort => {
  return {
    get: async (progressKey) => {
      return (await db.storyProgresses.get(progressKey)) ?? null;
    },
  };
};

export const getDexieProgressRepository = (): ProgressRepositoryPort =>
  _getDexieProgressRepository(db);
