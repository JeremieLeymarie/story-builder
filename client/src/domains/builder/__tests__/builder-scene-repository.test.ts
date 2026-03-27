import { beforeEach, describe, expect, test } from "vitest";
import { getTestDatabase } from "@/lib/storage/dexie/test-db";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { getTestFactory } from "@/lib/testing/factory";
import { _getDexieBuilderStoryRepository } from "../builder-story-repository";
import {
  _getDexieBuilderSceneRepository,
  BuilderSceneRepositoryPort,
} from "../builder-scene-repository";
import { Scene } from "@/lib/storage/domain";

const factory = getTestFactory();

describe("builder scene repository", () => {
  let repo: BuilderSceneRepositoryPort;
  let testDB: DexieDatabase;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieBuilderSceneRepository(testDB);
  });

  describe("bulk add", () => {
    test("no scenes", async () => {
      expect(await repo.bulkAdd([])).toStrictEqual([]);
      expect(await testDB.scenes.count()).toStrictEqual(0);
    });

    test("one scene", async () => {
      const { key, ...scene } = factory.scene({ key: undefined });
      const keys = await repo.bulkAdd([scene]);
      const scenesFromDB = await testDB.scenes.toArray();

      expect(keys).toStrictEqual([scenesFromDB[0]!.key]);
      expect(scenesFromDB.map(({ key, ...rest }) => rest)).toMatchObject([
        scene,
      ]);
    });

    test("multiple scenes", async () => {
      const { key, ...scene1 } = factory.scene({ key: undefined });
      const scene2 = factory.scene();
      const scenes = [scene1, scene2].sort((a, b) =>
        a.title.localeCompare(b.title),
      );

      const keys = await repo.bulkAdd(scenes);

      const scenesFromDB = (await testDB.scenes.toArray()).sort((a, b) =>
        a.title.localeCompare(b.title),
      );

      expect(keys.sort()).toStrictEqual(
        scenesFromDB.map(({ key }) => key).sort(),
      );
      expect(scenesFromDB).toHaveLength(2);
      expect(scenesFromDB).toMatchObject(scenes);
    });
  });

  describe("update", () => {
    test("update the correct scene", async () => {
      const scenes = [factory.scene(), factory.scene()];
      await repo.bulkAdd(scenes);
      const [sceneA, sceneB] = scenes as [Scene, Scene];

      const payload = factory.scene({ key: sceneA.key });
      await repo.update(sceneA.key, payload);
      console.log(sceneA, sceneB, payload);
      expect(await repo.get(sceneA.key)).toStrictEqual(payload);
      expect(await repo.get(sceneB.key)).toStrictEqual(sceneB); // Unchanged
    });
  });
});
