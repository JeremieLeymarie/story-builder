import { User, Wiki } from "@/lib/storage/domain";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";
import { getUser } from "@/lib/auth";

export type WikiServicePort = {
  getAllWikis: () => Promise<Wiki[]>;
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
  return {
    getAllWikis: async () => {
      const user = await context.getUser();
      return repository.getUserWikis(user?.key);
    },
  };
};

export const getWikiService = async () => {
  return _getWikiService({
    repository: getDexieWikiRepository(),
    context: { getUser },
  });
};
