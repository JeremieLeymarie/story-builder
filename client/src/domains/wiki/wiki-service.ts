import {
  Wiki,
  WikiArticle,
  WikiArticleLink,
  WikiCategory,
} from "@/lib/storage/domain";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";
import { WikiSchema } from "@/wikis/wiki-form";
import { ArticleUpdatePayload, WikiData } from "./types";
import { EntityNotExistError, ForbiddenError } from "../errors";
import { AuthContextPort, getAuthContext } from "../user/auth-context";
import {
  getWikiPermissionContext,
  WikiPermissionContext,
} from "./wiki-permission-context";
import { ArticleSchema, CategorySchema } from "@/wikis/schemas";
import { WikiCategoryNameTaken } from "./errors";
import { nanoid } from "nanoid";

const DEFAULT_CATEGORIES: Omit<WikiCategory, "key" | "wikiKey">[] = [
  { name: "Person", color: "#005f73" },
  { name: "Culture", color: "#94d2bd" },
  { name: "Geography", color: "#ee9b00" },
  { name: "Event", color: "#bb3e03" },
];

export type WikiExportData = {
  wiki: Wiki;
  articles: WikiArticle[];
  categories: WikiCategory[];
  articleLinks: WikiArticleLink[];
};

export type WikiServicePort = {
  getAllWikis: () => Promise<{ userWikis: Wiki[]; importedWikis: Wiki[] }>;
  addAuthorToWikis: (userInfo: {
    username: string;
    key: string;
  }) => Promise<void>;
  createWiki: (payload: WikiSchema) => Promise<string>;
  getWikiData: (wikiKey: string) => Promise<WikiData | null>;
  createArticle: (wikiKey: string, payload: ArticleSchema) => Promise<string>;
  getArticle: (articleKey: string) => Promise<WikiArticle | null>;
  removeArticle: (articleKey: string) => Promise<void>;
  updateArticle: (
    articleKey: string,
    payload: ArticleUpdatePayload,
  ) => Promise<void>;
  createCategory: (wikiKey: string, payload: CategorySchema) => Promise<string>;
  deleteCategory: (wikiKey: string, categoryKey: string) => Promise<void>;
  addArticleLink: (payload: WikiArticleLink) => Promise<void>;
  updateArticleLink: (payload: WikiArticleLink) => Promise<void>;
  removeArticleLink: (
    payload: Pick<WikiArticleLink, "entityKey" | "entityType" | "key">,
  ) => Promise<void>;
  makeArticleLinkKey: () => string;
  getArticleLink: (
    articleLinkKey: string,
    entityKey: string,
  ) => Promise<WikiArticleLink | null>;
  deleteArticle: (wikiKey: string, articleKey: string) => Promise<void>;
  getArticleLinkCountByArticle: (articleKey: string) => Promise<number>;
  getWikiExportData: (wikiKey: string) => Promise<WikiExportData | null>;
};

export const _getWikiService = ({
  repository,
  authContext,
  getPermissionContext,
}: {
  repository: WikiRepositoryPort;
  authContext: AuthContextPort;
  getPermissionContext: (wikiKey: string) => Promise<WikiPermissionContext>;
}): WikiServicePort => {
  const getUserWikis = async () => {
    const user = await authContext.getUser();
    return repository.getUserWikis(user?.key);
  };

  return {
    getAllWikis: async () => {
      const [userWikis, importedWikis] = await Promise.all([
        getUserWikis(),
        repository.getImportedWikis(),
      ]);

      return { userWikis, importedWikis };
    },

    addAuthorToWikis: async ({ username, key }) => {
      const wikis = (await getUserWikis()).filter(
        (wiki) => wiki.author === undefined && wiki.type === "created",
      );
      await repository.bulkUpdate(
        wikis.map((wiki) => ({ key: wiki.key, author: { username, key } })),
      );
    },
    createWiki: async (payload) => {
      const user = await authContext.getUser();
      const key = await repository.create({
        name: payload.name,
        description: payload.description,
        image: payload.image,
        author: user ? { username: user.username, key: user.key } : undefined,
        createdAt: new Date(),
        type: "created",
      });

      await Promise.all(
        DEFAULT_CATEGORIES.map((category) =>
          repository.createCategory({ ...category, wikiKey: key }),
        ),
      );

      return key;
    },

    getWikiData: async (wikiKey) => {
      const wiki = await repository.get(wikiKey);
      if (!wiki) throw new EntityNotExistError("wiki", wikiKey);
      const sections = await repository.getSections(wiki.key);

      return { wiki, sections };
    },

    createArticle: async (wikiKey, payload) => {
      const permissionContext = await getPermissionContext(wikiKey);
      if (!permissionContext.canCreateArticle) throw new ForbiddenError();

      const now = new Date();
      return await repository.createArticle({
        wikiKey: wikiKey,
        title: payload.title,
        content: payload.content,
        image: payload.image,
        createdAt: now,
        updatedAt: now,
        ...(payload.categoryKey ? { categoryKey: payload.categoryKey } : {}),
      });
    },

    getArticle: async (articleKey) => {
      return await repository.getArticle(articleKey);
    },

    removeArticle: async (articleKey) => {
      return await repository.removeArticle(articleKey);
    },

    updateArticle: async (articleKey, payload) => {
      const article = await repository.getArticle(articleKey);
      if (!article) throw new EntityNotExistError("wiki-article", articleKey);

      const permissionContext = await getPermissionContext(article.wikiKey);
      if (!permissionContext.canEditArticle) throw new ForbiddenError();

      return await repository.updateArticle(articleKey, payload);
    },

    createCategory: async (wikiKey, payload) => {
      const permissionContext = await getPermissionContext(wikiKey);
      if (!permissionContext.canCreateCategory) throw new ForbiddenError();

      const categoryNames = (await repository.getSections(wikiKey)).map(
        (section) => section.category?.name,
      );
      if (categoryNames.includes(payload.name))
        throw new WikiCategoryNameTaken(wikiKey, payload.name);

      return await repository.createCategory({
        wikiKey,
        color: payload.color,
        name: payload.name,
      });
    },

    deleteCategory: async (wikiKey, categoryKey) => {
      const permissionContext = await getPermissionContext(wikiKey);
      if (!permissionContext.canDeleteCategory) throw new ForbiddenError();

      await repository.uncategorizeArticlesByCategory(categoryKey);
      await repository.deleteCategory(categoryKey);
    },

    addArticleLink: async (payload) => {
      await repository.addArticleLink(payload);
    },

    updateArticleLink: async (payload) => {
      await repository.updateArticleLink(payload);
    },

    removeArticleLink: async (payload) => {
      await repository.removeArticleLink(payload.key, payload.entityKey);
    },

    makeArticleLinkKey: nanoid,

    getArticleLink: async (articleLinkKey, entityKey) => {
      const articleLink = await repository.getArticleLink(
        articleLinkKey,
        entityKey,
      );
      return articleLink;
    },

    deleteArticle: async (wikiKey, articleKey) => {
      const permissionContext = await getPermissionContext(wikiKey);
      if (!permissionContext.canDeleteArticle) throw new ForbiddenError();

      const article = await repository.getArticle(articleKey);
      if (!article) throw new EntityNotExistError("wiki-article", articleKey);

      await repository.deleteArticleLinksByArticle(articleKey);
      await repository.deleteArticle(articleKey);
    },

    getArticleLinkCountByArticle: async (articleKey) => {
      const links = await repository.getArticleLinksByArticle(articleKey);
      return links.length;
    },

    getWikiExportData: async (wikiKey) => {
      const [wiki, categories, articles] = await Promise.all([
        repository.get(wikiKey),
        repository.getCategories(wikiKey),
        repository.getArticles(wikiKey),
      ]);

      if (!wiki) return null;

      const articleLinks = await repository.getArticleLinksFromArticleKeys(
        articles.map((a) => a.key),
      );

      return { wiki, articles, categories, articleLinks };
    },
  };
};

export const getWikiService = () => {
  return _getWikiService({
    repository: getDexieWikiRepository(),
    authContext: getAuthContext(),
    getPermissionContext: getWikiPermissionContext,
  });
};
