import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { EntityNotExistError } from "../errors";

export type GameRepositoryPort = {
  deleteWiki: (gameKey: string) => Promise<void>;
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
  };
};

export const getDexieGameRepository = (): GameRepositoryPort =>
  _getDexieGameRepository(db);
