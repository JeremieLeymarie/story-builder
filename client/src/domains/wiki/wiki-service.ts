import { Wiki, WikiArticle } from "@/lib/storage/domain";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";
import { WikiSchema } from "@/wikis/wiki-form";
import { ArticleSchema } from "@/wikis/schema";
import { ArticleUpdatePayload, WikiData } from "./types";
import { EntityNotExistError, ForbiddenError } from "../errors";
import { AuthContextPort, getAuthContext } from "../user/auth-context";
import {
  getWikiPermissionContext,
  WikiPermissionContext,
} from "./wiki-permission-context";

export type WikiServicePort = {
  getAllWikis: () => Promise<Wiki[]>;
  addAuthorToWikis: (userInfo: {
    username: string;
    key: string;
  }) => Promise<void>;
  createWiki: (payload: WikiSchema) => Promise<string>;
  getWikiData: (wikiKey: string) => Promise<WikiData | null>;
  createArticle: (wikiKey: string, payload: ArticleSchema) => Promise<string>;
  getArticle: (articleKey: string) => Promise<WikiArticle | null>;
  updateArticle: (
    articleKey: string,
    payload: ArticleUpdatePayload,
  ) => Promise<void>;
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
  const getAllWikis = async () => {
    const user = await authContext.getUser();
    return repository.getUserWikis(user?.key);
  };

  return {
    getAllWikis,

    addAuthorToWikis: async ({ username, key }) => {
      const wikis = (await getAllWikis()).filter(
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

      return key;
    },

    getWikiData: async (wikiKey) => {
      return await repository.get(wikiKey);
    },

    createArticle: async (wikiKey, payload) => {
      const permissionContext = await getPermissionContext(wikiKey);
      if (!permissionContext.canCreateArticle()) throw new ForbiddenError();

      return await repository.createArticle({
        wikiKey: wikiKey,
        title: payload.title,
        content: payload.content,
        image: payload.image,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(payload.categoryKey ? { categoryKey: payload.categoryKey } : {}),
      });
    },

    getArticle: async (articleKey) => {
      return await repository.getArticle(articleKey);
    },

    updateArticle: async (articleKey, payload) => {
      const article = await repository.getArticle(articleKey);
      if (!article) throw new EntityNotExistError("wiki-article", articleKey);

      const permissionContext = await getPermissionContext(article.wikiKey);
      if (!permissionContext.canEditArticle()) throw new ForbiddenError();

      return await repository.updateArticle(articleKey, payload);
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
