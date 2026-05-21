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
  create: (payload: WithoutKey<Scene>) => Promise<Scene>;
  bulkAdd: (payload: WithoutKey<Scene>[] | Scene[]) => Promise<string[]>;
  bulkUpdate: (payload: Scene[]) => Promise<void>;
  update: (key: string, payload: Partial<Scene>) => Promise<void>;
  delete: (sceneKeys: string[], storyKey: string) => Promise<void>;
};

export const _getDexieBuilderSceneRepository = (
  db: DexieDatabase,
): BuilderSceneRepositoryPort => {
  const touchStory = async (storyKey: string) => {
    await db.stories.update(storyKey, { updatedAt: new Date() });
  };

  return {
    create: async (payload) => {
      const key = await db.scenes.add(structuredClone(payload));
      await touchStory(payload.storyKey);
      return { ...payload, key };
    },

    bulkAdd: async (payload) => {
      const keys = (await db.scenes.bulkAdd(structuredClone(payload), {
        allKeys: true,
      })) as string[];
      const storyKeys = [...new Set(payload.map((scene) => scene.storyKey))];
      await Promise.all(storyKeys.map((storyKey) => touchStory(storyKey)));
      return keys;
    },

    get: async (sceneKey) => {
      return (await db.scenes.get(sceneKey)) ?? null;
    },

    getScenesByKey: async (sceneKeys) => {
      const scenes = await db.scenes.bulkGet(sceneKeys);

      return _sceneArrayToMapping(scenes);
    },

    bulkUpdate: async (payload) => {
      await db.scenes.bulkUpdate(
        payload.map(({ key, ...scene }) => ({ key, changes: scene })),
      );
      const storyKeys = [...new Set(payload.map((scene) => scene.storyKey))];
      console.log(storyKeys);
      await Promise.all(storyKeys.map((storyKey) => touchStory(storyKey)));
    },

    update: async (key, payload) => {
      const current = await db.scenes.get(key);
      if (!current) return;
      await db.scenes.update(key, payload);
      await touchStory(payload.storyKey ?? current.storyKey);
    },

    delete: async (sceneKeys, storyKey) => {
      await db.scenes.bulkDelete(sceneKeys);
      await touchStory(storyKey);
    },
  };
};

export const getDexieBuilderSceneRepository =
  (): BuilderSceneRepositoryPort => {
    return _getDexieBuilderSceneRepository(db);
  };
