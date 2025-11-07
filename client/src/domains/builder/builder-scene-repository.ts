import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { Scene } from "@/lib/storage/domain";

export type BuilderSceneRepositoryPort = {
  get: (sceneKey: string) => Promise<Scene | null>;
};

export const _getDexieBuilderSceneRepository = (
  db: DexieDatabase,
): BuilderSceneRepositoryPort => {
  return {
    get: async (sceneKey) => {
      return (await db.scenes.get(sceneKey)) ?? null;
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
