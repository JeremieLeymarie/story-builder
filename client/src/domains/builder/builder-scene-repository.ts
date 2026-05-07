import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

const _sceneArrayToMapping = (scenes: (Scene | undefined)[]) =>
  scenes.reduce(
    (acc, scene) => (scene ? { ...acc, [scene.key]: scene } : acc),
    {},
  );

export type BuilderSceneRepositoryPort = {
  get: (key: string) => Promise<Scene | null>;
  getScenesByKey: (keys: string[]) => Promise<Record<string, Scene>>;
  bulkAdd: (payload: WithoutKey<Scene>[] | Scene[]) => Promise<string[]>;
  update: (key: string, payload: Scene) => Promise<void>;
  bulkUpdate: (changesByKey: Record<string, Partial<Scene>>) => Promise<void>;
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
      const scenes = await db.scenes.bulkGet(sceneKeys);

      return _sceneArrayToMapping(scenes);
    },

    update: async (key, payload) => {
      await db.scenes.update(key, payload);
    },

    bulkUpdate: async (changesByKey) => {
      await db.scenes.bulkUpdate(
        Object.entries(changesByKey).map(([sceneKey, changes]) => ({
          key: sceneKey,
          changes,
        })),
      );
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
