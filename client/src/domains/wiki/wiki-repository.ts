import { Database, db } from "@/lib/storage/dexie/dexie-db";
import { Wiki, WikiArticle } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type WikiRepositoryPort = {
  getUserWikis: (userKey: string | undefined) => Promise<Wiki[]>;
  bulkUpdate: (
    wikis: ({ key: string } & Partial<Omit<Wiki, "key">>)[],
  ) => Promise<void>;
  create: (wiki: WithoutKey<Wiki>) => Promise<string>;
  get: (wikiKey: string) => Promise<Wiki | null>;
  createArticle: (payload: WithoutKey<WikiArticle>) => Promise<string>;
};

export const _getDexieWikiRepository = (db: Database): WikiRepositoryPort => {
  return {
    getUserWikis: async (userKey) => {
      return await db.wikis
        .filter(
          (wiki) =>
            [userKey, undefined].includes(wiki.author?.key) &&
            wiki.type === "created",
        )
        .toArray();
    },
    bulkUpdate: async (wikis) => {
      const uniqueKeys = new Set(wikis.map(({ key }) => key));
      if (uniqueKeys.size !== wikis.length) {
        throw new Error("Each wiki can only be present once in the input");
      }

      await db.wikis.bulkUpdate(
        wikis.map(({ key, ...changes }) => ({ key, changes })),
      );
    },

    create: async (wiki) => {
      return await db.wikis.add(wiki);
    },

    get: async (wikiKey) => {
      return (await db.wikis.get(wikiKey)) ?? null;
    },

    createArticle: async (payload) => {
      return await db.wikiArticles.add(payload);
    },
  };
};

export const getDexieWikiRepository = (): WikiRepositoryPort => {
  return _getDexieWikiRepository(db);
};
