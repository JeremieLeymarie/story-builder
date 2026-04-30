import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type BuilderSceneRepositoryPort = {
  get: (key: string) => Promise<Scene | null>;
  getScenesByKey: (keys: string[]) => Promise<Record<string, Scene>>;
  getByStoryKey: (storyKey: string) => Promise<Scene[]>;
  bulkAdd: (payload: WithoutKey<Scene>[] | Scene[]) => Promise<string[]>;
  update: (key: string, payload: Scene) => Promise<void>;
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
    getScenesByKey: async (sceneKeys) => {
      const scenesByKey = (await db.scenes.bulkGet(sceneKeys)).reduce(
        (acc, scene) => (scene ? { ...acc, [scene.key]: scene } : acc),
        {},
      );

      return scenesByKey;
    },
    getByStoryKey: async (storyKey) => {
      return await db.scenes.where("storyKey").equals(storyKey).toArray();
    },
    update: async (key, payload) => {
      await db.scenes.update(key, payload);
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
