import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type BuilderSceneRepositoryPort = {
  get: (sceneKey: string) => Promise<Scene | null>;
  bulkAdd: (payload: WithoutKey<Scene>[]) => Promise<string[]>;
};

export const _getDexieBuilderSceneRepository = (
  db: DexieDatabase,
): BuilderSceneRepositoryPort => {
  return {
    bulkAdd: async (payload) => {
      return (await db.scenes.bulkAdd(structuredClone(payload), {
        allKeys: true,
      })) as string[];
    },
    get: async (sceneKey) => {
      return (await db.scenes.get(sceneKey)) ?? null;
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
