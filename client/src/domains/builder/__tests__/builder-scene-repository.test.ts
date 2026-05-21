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
import { makeSimpleLexicalContent } from "@/lib/lexical-content";

const factory = getTestFactory();

describe("builder scene repository", () => {
  let repo: BuilderSceneRepositoryPort;
  let testDB: DexieDatabase;
  let story: ReturnType<typeof factory.story.builder>;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieBuilderSceneRepository(testDB);
    story = factory.story.builder({
      key: "story-key",
      updatedAt: new Date("2025-01-01"),
    });
    await testDB.stories.add(story);
  });

  describe("create", () => {
    test("create scene", async () => {
      expect(await testDB.scenes.count()).toStrictEqual(0);

      const sceneToCreate = factory.scene({ storyKey: story.key });
      await repo.create(sceneToCreate);

      expect(await testDB.scenes.count()).toStrictEqual(1);
      expect(await testDB.scenes.get(sceneToCreate.key)).toStrictEqual(
        sceneToCreate,
      );
      expect(
        (await testDB.stories.get(story.key))?.updatedAt.getTime(),
      ).toBeGreaterThan(story.updatedAt.getTime());
    });
  });

  describe("bulk add", () => {
    test("no scenes", async () => {
      expect(await repo.bulkAdd([])).toStrictEqual([]);
      expect(await testDB.scenes.count()).toStrictEqual(0);
    });

    test("one scene", async () => {
      const { key, ...scene } = factory.scene({
        key: undefined,
        storyKey: story.key,
      });
      const keys = await repo.bulkAdd([scene]);
      const scenesFromDB = await testDB.scenes.toArray();
      const updatedStory = await testDB.stories.get(story.key);

      expect(keys).toStrictEqual([scenesFromDB[0]!.key]);
      expect(scenesFromDB.map(({ key, ...rest }) => rest)).toMatchObject([
        scene,
      ]);
      expect(updatedStory?.updatedAt.getTime()).toBeGreaterThan(
        story.updatedAt.getTime(),
      );
    });

    test("multiple scenes", async () => {
      const { key, ...scene1 } = factory.scene({
        key: undefined,
        storyKey: story.key,
      });
      const scene2 = factory.scene({ storyKey: story.key });
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

  describe("get", () => {
    test("get scene", async () => {
      const scenes = [
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
      ];
      await testDB.scenes.bulkAdd(scenes);

      const scene = await repo.get(scenes[1]!.key);

      expect(scene).toStrictEqual(scenes[1]);
    });
  });

  describe("getScenesByKey", () => {
    test("get scenes", async () => {
      const [sceneA, sceneB, sceneC] = [
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
      ];
      await testDB.scenes.bulkAdd([sceneA, sceneB, sceneC]);

      const scenesByKey = await repo.getScenesByKey([sceneA.key, sceneC.key]);

      expect(scenesByKey).toStrictEqual({
        [sceneA.key]: sceneA,
        [sceneC.key]: sceneC,
      });
    });
  });

  describe("bulkUpdate", () => {
    test("update scenes", async () => {
      const otherStory = factory.story.builder({
        key: "other-story-key",
        updatedAt: new Date("2020-01-01"),
      });
      const [sceneA, sceneB, sceneC] = [
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: otherStory.key }),
      ];
      await testDB.stories.add(otherStory);
      await testDB.scenes.bulkAdd([sceneA, sceneB, sceneC]);

      await repo.bulkUpdate([
        { ...sceneB, title: "Updated title", actions: [] },
        { ...sceneC, content: makeSimpleLexicalContent("Updated content") },
      ]);

      expect(await testDB.scenes.count()).toStrictEqual(3);
      expect(await testDB.scenes.get(sceneB.key)).toStrictEqual({
        ...sceneB,
        title: "Updated title",
        actions: [],
      });
      expect(await testDB.scenes.get(sceneC.key)).toStrictEqual({
        ...sceneC,
        content: makeSimpleLexicalContent("Updated content"),
      });
      expect(await testDB.scenes.get(sceneA.key)).toStrictEqual(sceneA); // Unchanged
      expect(
        (await testDB.stories.get(story.key))?.updatedAt.getTime(),
      ).toBeGreaterThan(story.updatedAt.getTime());
      expect(
        (await testDB.stories.get(otherStory.key))?.updatedAt.getTime(),
      ).toBeGreaterThan(otherStory.updatedAt.getTime());
    });
  });

  describe("update", () => {
    test("update the correct scene", async () => {
      const scenes = [
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
      ];
      await repo.bulkAdd(scenes);
      const [sceneA, sceneB] = scenes as [Scene, Scene];

      const payload = factory.scene({ key: sceneA.key, storyKey: story.key });
      await repo.update(sceneA.key, payload);
      expect(await repo.get(sceneA.key)).toStrictEqual(payload);
      expect(await repo.get(sceneB.key)).toStrictEqual(sceneB); // Unchanged
    });
  });

  describe("delete", () => {
    test("delete scenes", async () => {
      const [sceneA, sceneB, sceneC] = [
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
        factory.scene({ storyKey: story.key }),
      ];
      await testDB.scenes.bulkAdd([sceneA, sceneB, sceneC]);

      expect(await testDB.scenes.count()).toStrictEqual(3);

      await repo.delete([sceneB.key, sceneA.key], story.key);

      expect(await testDB.scenes.count()).toStrictEqual(1);
      expect(await testDB.scenes.get(sceneC.key)).toBeDefined();
      expect(
        (await testDB.stories.get(story.key))?.updatedAt.getTime(),
      ).toBeGreaterThan(story.updatedAt.getTime());
    });
  });
});
