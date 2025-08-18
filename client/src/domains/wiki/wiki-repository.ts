import { Database, db } from "@/lib/storage/dexie/dexie-db";
import { Wiki } from "@/lib/storage/domain";

export type WikiRepositoryPort = {
  getUserWikis: (userKey: string | undefined) => Promise<Wiki[]>;
};

export const _getDexieWikiRepository = (db: Database): WikiRepositoryPort => {
  return {
    getUserWikis: async (userKey) => {
      return db.wikis
        .filter((wiki) => [userKey, undefined].includes(wiki.author?.key))
        .toArray();
    },
  };
};

export const getDexieWikiRepository = (): WikiRepositoryPort => {
  return _getDexieWikiRepository(db);
};
