import { User, Wiki, WikiArticle } from "@/lib/storage/domain";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";
import { getUser } from "@/lib/auth";
import { WikiSchema } from "@/wikis/wiki-form";
import { ArticleSchema } from "@/wikis/schema";
import { WikiData } from "./types";

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
};

export type WikiServiceContext = {
  getUser: () => Promise<User | null>;
};

export const _getWikiService = ({
  repository,
  context,
}: {
  repository: WikiRepositoryPort;
  context: WikiServiceContext;
}): WikiServicePort => {
  const getAllWikis = async () => {
    const user = await context.getUser();
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
      const user = await context.getUser();
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

    getArticle: async (articleKey: string) => {
      return await repository.getArticle(articleKey);
    },
  };
};

export const getWikiService = () => {
  return _getWikiService({
    repository: getDexieWikiRepository(),
    context: { getUser },
  });
};
