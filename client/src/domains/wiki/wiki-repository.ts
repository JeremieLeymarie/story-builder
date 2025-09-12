import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { Wiki, WikiArticle, WikiCategory } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";
import { ArticleUpdatePayload, WikiSection } from "./types";

export const NO_CATEGORY = "NO_CATEGORY";

export type WikiRepositoryPort = {
  getUserWikis: (userKey: string | undefined) => Promise<Wiki[]>;
  bulkUpdate: (
    wikis: ({ key: string } & Partial<Omit<Wiki, "key">>)[],
  ) => Promise<void>;
  create: (wiki: WithoutKey<Wiki>) => Promise<string>;
  get: (wikiKey: string) => Promise<Wiki | null>;
  getSections: (wikiKey: string) => Promise<WikiSection[]>;
  createArticle: (payload: WithoutKey<WikiArticle>) => Promise<string>;
  updateArticle: (
    articleKey: string,
    payload: ArticleUpdatePayload,
  ) => Promise<void>;
  getArticle: (articleKey: string) => Promise<WikiArticle | null>;
  createCategory: (payload: WithoutKey<WikiCategory>) => Promise<string>;
};

export const _getDexieWikiRepository = (
  db: DexieDatabase,
): WikiRepositoryPort => {
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

      return wiki;
    },

    getSections: async (wikiKey) => {
      const categories = await db.wikiCategories
        .filter((cat) => cat.wikiKey === wikiKey)
        .toArray();

      const articlesByCategoryKey = categories.reduce(
        (acc, cat) => ({ ...acc, [cat.key]: [] }),
        {} as {
          [categoryKey: string]: WikiSection["articles"];
        },
      );
      const categoryKeys = Object.keys(articlesByCategoryKey);

      await db.wikiArticles.where({ wikiKey }).each((article) => {
        const key =
          article.categoryKey && categoryKeys.includes(article.categoryKey)
            ? article.categoryKey
            : NO_CATEGORY;

        const simpleArticle = { title: article.title, key: article.key };
        if (articlesByCategoryKey[key]) {
          articlesByCategoryKey[key].push(simpleArticle);
        } else {
          articlesByCategoryKey[key] = [simpleArticle];
        }
      });

      const sections = Object.entries(articlesByCategoryKey).map(
        ([categoryKey, articles]) => {
          const category =
            categories.find((cat) => cat?.key === categoryKey) ?? null;

          return {
            category: category
              ? {
                  key: category.key,
                  name: category.name,
                  color: category.color,
                }
              : null,
            articles,
          };
        },
      );

      return sections;
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

    createCategory: async (payload) => {
      return await db.wikiCategories.add(payload);
    },
  };
};

export const getDexieWikiRepository = (): WikiRepositoryPort => {
  return _getDexieWikiRepository(db);
};
