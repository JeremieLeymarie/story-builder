import { User, Wiki } from "@/lib/storage/domain";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";
import { getUser } from "@/lib/auth";
import { WikiSchema } from "@/wikis/wiki-form";

export type WikiServicePort = {
  getAllWikis: () => Promise<Wiki[]>;
  addAuthorToWikis: (userInfo: {
    username: string;
    key: string;
  }) => Promise<void>;
  createWiki: (payload: WikiSchema) => Promise<string>;
  getWikiData: (wikiKey: string) => Promise<Wiki | null>;
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
  };
};

export const getWikiService = () => {
  return _getWikiService({
    repository: getDexieWikiRepository(),
    context: { getUser },
  });
};
