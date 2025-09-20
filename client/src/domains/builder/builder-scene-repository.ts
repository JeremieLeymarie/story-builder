import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { BuilderSceneRepositoryPort } from "./ports/builder-scene-repository-port";

export const _getDexieBuilderSceneRepository = (
  db: DexieDatabase,
): BuilderSceneRepositoryPort => {
  return {
    bulkAdd: async (payload) => {
      return await db.scenes.bulkAdd(structuredClone(payload), {
        allKeys: true,
      });
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
