import { Database, db } from "@/lib/storage/dexie/dexie-db";
import { Wiki, WikiArticle } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";
import { ArticleUpdatePayload, WikiData } from "./types";

export type WikiRepositoryPort = {
  getUserWikis: (userKey: string | undefined) => Promise<Wiki[]>;
  bulkUpdate: (
    wikis: ({ key: string } & Partial<Omit<Wiki, "key">>)[],
  ) => Promise<void>;
  create: (wiki: WithoutKey<Wiki>) => Promise<string>;
  get: (wikiKey: string) => Promise<WikiData | null>;
  createArticle: (payload: WithoutKey<WikiArticle>) => Promise<string>;
  updateArticle: (
    articleKey: string,
    payload: ArticleUpdatePayload,
  ) => Promise<void>;
  getArticle: (articleKey: string) => Promise<WikiArticle | null>;
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
      const wiki = await db.wikis.get(wikiKey);
      if (!wiki) return null;

      const NO_CATEGORY = "NO_CATEGORY";
      const articlesByCategoryKey: {
        [categoryKey: string]: WikiArticle[];
      } = {};
      await db.wikiArticles.where({ wikiKey }).each((article) => {
        const key = article.categoryKey ?? NO_CATEGORY;
        if (articlesByCategoryKey[key]) {
          articlesByCategoryKey[key].push(article);
        } else {
          articlesByCategoryKey[key] = [article];
        }
      });

      const categoryKeys = Object.keys(articlesByCategoryKey).filter(
        (key) => key !== NO_CATEGORY,
      );
      const categories = await db.wikiCategories.bulkGet(categoryKeys);

      const sections = Object.entries(articlesByCategoryKey).map(
        ([categoryKey, articles]) => {
          const category =
            categories.find((cat) => cat?.key === categoryKey) ?? null;

          return {
            category,
            articles,
          };
        },
      );

      return { wiki, sections };
    },

    createArticle: async (payload) => {
      return await db.wikiArticles.add(payload);
    },

    updateArticle: async (articleKey, payload) => {
      await db.wikiArticles.update(articleKey, {
        ...payload,
        updatedAt: new Date(),
      });
    },

    getArticle: async (articleKey) => {
      return (await db.wikiArticles.get(articleKey)) ?? null;
    },
  };
};

export const getDexieWikiRepository = (): WikiRepositoryPort => {
  return _getDexieWikiRepository(db);
};
