import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { EntityNotExistError } from "../errors";
import { Scene } from "@/lib/storage/domain";

export type GameRepositoryPort = {
  deleteWiki: (gameKey: string) => Promise<void>;
  getScenes: (gameKey: string) => Promise<Scene[]>;
};

export const _getDexieGameRepository = (
  db: DexieDatabase,
): GameRepositoryPort => {
  return {
    deleteWiki: async (gameKey) => {
      const game = await db.stories.get(gameKey);
      if (!game) throw new EntityNotExistError("story", gameKey);

      if (!game.wikiKey) return;

      await db.wikis.delete(game.wikiKey);
      const articleKeys = (
        await db.wikiArticles
          .filter((art) => art.wikiKey === game.wikiKey)
          .toArray()
      ).map(({ key }) => key);

      await db.wikiArticles.bulkDelete(articleKeys);
      await db.wikiCategories.where("wikiKey").equals(game.wikiKey).delete();
      await db.wikiArticleLinks.where("articleKey").anyOf(articleKeys).delete();
    },

    getScenes: async (gameKey) => {
      return await db.scenes
        .filter((scene) => scene.storyKey === gameKey)
        .toArray();
    },
  };
};

export const getDexieGameRepository = (): GameRepositoryPort =>
  _getDexieGameRepository(db);
