import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { BuilderSceneRepositoryPort } from "./ports/builder-scene-repository-port";

export const _getDexieBuilderSceneRepository = (
  db: DexieDatabase,
): BuilderSceneRepositoryPort => {
  return {
    // TODO: unit tests
    bulkAdd: async (payload) => {
      return await db.scenes.bulkAdd(payload, { allKeys: true });
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
