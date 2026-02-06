import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { BuilderSceneRepositoryPort } from "./ports/builder-scene-repository-port";

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
    getScenesByKey: async (sceneKeys) => {
      const scenesByKey = (await db.scenes.bulkGet(sceneKeys)).reduce(
        (acc, scene) => (scene ? { ...acc, [scene.key]: scene } : acc),
        {},
      );

      return scenesByKey;
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
