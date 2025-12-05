import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import {
  Wiki,
  WikiArticle,
  WikiArticleLink,
  WikiCategory,
} from "@/lib/storage/domain";
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
  deleteCategory: (categoryKey: string) => Promise<void>;
  deleteArticlesByCategory: (categoryKey: string) => Promise<void>;
  addArticleLink: (payload: WikiArticleLink) => Promise<void>;
  updateArticleLink: (payload: WikiArticleLink) => Promise<void>;
  removeArticleLink: (key: string, entityKey: string) => Promise<void>;
  getArticleLink: (
    key: string,
    entityKey: string,
  ) => Promise<WikiArticleLink | null>;
  deleteArticle: (articleKey: string) => Promise<void>;
  getArticleLinksByArticle: (articleKey: string) => Promise<WikiArticleLink[]>;
  deleteArticleLinksByArticle: (articleKey: string) => Promise<void>;
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

    deleteCategory: async (categoryKey) => {
      await db.wikiCategories.delete(categoryKey);
    },

    deleteArticlesByCategory: async (categoryKey) => {
      await db.wikiArticles.where({ categoryKey }).delete();
    },

    addArticleLink: async (payload: WikiArticleLink) => {
      await db.wikiArticleLinks.add(payload, [payload.key, payload.entityKey]);
    },

    updateArticleLink: async (payload: WikiArticleLink) => {
      await db.wikiArticleLinks.update(payload, payload);
    },

    removeArticleLink: async (key: string, entityKey: string) => {
      await db.wikiArticleLinks
        .where(["key", "entityKey"])
        .equals([key, entityKey])
        .delete();
    },

    getArticleLink: async (key, entityKey) => {
      return (
        (await db.wikiArticleLinks.where({ key, entityKey }).first()) ?? null
      );
    },

    deleteArticle: async (articleKey) => {
      await db.wikiArticles.delete(articleKey);
    },

    getArticleLinksByArticle: async (articleKey) => {
      return await db.wikiArticleLinks
        .filter((link) => link.articleKey === articleKey)
        .toArray();
    },

    deleteArticleLinksByArticle: async (articleKey) => {
      const links = await db.wikiArticleLinks
        .filter((link) => link.articleKey === articleKey)
        .toArray();
      const keysToDelete = links.map(
        (link) => [link.key, link.entityKey] as [string, string],
      );
      await db.wikiArticleLinks.bulkDelete(keysToDelete);
    },
  };
};

export const getDexieWikiRepository = (): WikiRepositoryPort => {
  return _getDexieWikiRepository(db);
};
