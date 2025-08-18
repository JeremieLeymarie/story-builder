import { Wiki } from "@/lib/storage/domain";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";
import { getUser } from "@/lib/auth";

export type WikiServicePort = {
  getAllWikis: () => Promise<Wiki[]>;
};

export type WikiServiceContext = {
  userKey: string | undefined;
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
      return repository.getUserWikis(context.userKey);
    },
  };
};

export const getWikiService = async () => {
  return _getWikiService({
    repository: getDexieWikiRepository(),
    context: {
      userKey: (await getUser())?.key,
    },
  });
};
