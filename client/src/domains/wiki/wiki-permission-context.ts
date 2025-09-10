import { AuthContextPort, getAuthContext } from "../user/auth-context";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";

export type WikiPermissionContext = {
  canCreateArticle: () => boolean;
  canEditArticle: () => boolean;
  canDeleteArticle: () => boolean;
};

export const _getWikiPermissionContext = async ({
  authContext,
  wikiKey,
  wikiRepository,
}: {
  authContext: AuthContextPort;
  wikiKey: string;
  wikiRepository: WikiRepositoryPort;
}): Promise<WikiPermissionContext> => {
  const user = await authContext.getUser();
  const wikiAuthor = (await wikiRepository.get(wikiKey))?.wiki.author;

  return {
    canCreateArticle: () => wikiAuthor?.key === user?.key,
    canEditArticle: () => wikiAuthor?.key === user?.key,
    canDeleteArticle: () => wikiAuthor?.key === user?.key,
  };
};

export const getWikiPermissionContext = async (wikiKey: string) => {
  return _getWikiPermissionContext({
    authContext: getAuthContext(),
    wikiRepository: getDexieWikiRepository(),
    wikiKey,
  });
};
