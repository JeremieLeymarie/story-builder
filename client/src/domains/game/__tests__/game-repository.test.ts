import { _getDexieWikiRepository } from "@/domains/wiki/wiki-repository";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { getTestDatabase } from "@/lib/storage/dexie/test-db";
import { getTestFactory } from "@/lib/testing/factory";
import { beforeEach, describe, expect, test } from "vitest";
import {
  _getDexieGameRepository,
  GameRepositoryPort,
} from "../game-repository";
import { Wiki } from "@/lib/storage/domain";

const factory = getTestFactory();

describe("game-repository", () => {
  let repo: GameRepositoryPort;
  let testDB: DexieDatabase;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieGameRepository(testDB);
  });

  describe("delete wiki", () => {
    let wiki: Wiki;

    beforeEach(async () => {
      wiki = factory.wiki({ type: "imported" });
      const article = factory.wikiArticle({ wikiKey: wiki.key });
      const cat = factory.wikiCategory({ wikiKey: wiki.key });
      const artLink = factory.wikiArticleLink({ articleKey: article.key });

      await testDB.wikis.add(wiki);
      await testDB.wikiCategories.add(cat);
      await testDB.wikiArticles.add(article);
      await testDB.wikiArticleLinks.add(artLink);
    });

    test("should delete everything associated with the wiki in cascade", async () => {
      const game = factory.story.library({ wikiKey: wiki.key });
      await testDB.stories.add(game);

      await repo.deleteWiki(game.key);

      expect(await testDB.wikis.count()).toStrictEqual(0);
      expect(await testDB.wikiArticles.count()).toStrictEqual(0);
      expect(await testDB.wikiCategories.count()).toStrictEqual(0);
      expect(await testDB.wikiArticleLinks.count()).toStrictEqual(0);
    });

    test("should not do anything if the story has no wiki", async () => {
      const game = factory.story.library({ wikiKey: undefined });
      await testDB.stories.add(game);

      await testDB.stories.update(game.key, { wikiKey: undefined });

      expect(await testDB.wikis.count()).toStrictEqual(1);
      expect(await testDB.wikiArticles.count()).toStrictEqual(1);
      expect(await testDB.wikiCategories.count()).toStrictEqual(1);
      expect(await testDB.wikiArticleLinks.count()).toStrictEqual(1);
    });
  });

  describe("get scenes", () => {
    test("should get all scenes of given game", async () => {
      const [storyA, storyB] = [
        factory.story.builder(),
        factory.story.builder(),
      ];
      const [sceneA, sceneB, sceneC] = [
        factory.scene({ key: "a", storyKey: storyA.key }),
        factory.scene({ key: "b", storyKey: storyA.key }),
        factory.scene({ key: "c", storyKey: storyB.key }),
      ];
      await testDB.stories.bulkAdd([storyA, storyB]);
      await testDB.scenes.bulkAdd([sceneA, sceneB, sceneC]);

      const scenes = await repo.getScenes(storyA.key);
      expect(scenes.sort((a, b) => a.key.localeCompare(b.key))).toStrictEqual([
        sceneA,
        sceneB,
      ]);
    });
  });

  describe("get scene", () => {
    test("get scene", async () => {
      const [sceneA, sceneB] = [factory.scene(), factory.scene()];
      await testDB.scenes.bulkAdd([sceneA, sceneB]);

      const scene = await repo.getScene(sceneA.key);

      expect(scene).toStrictEqual(sceneA);
    });
  });
});
