import { AuthContextPort, getAuthContext } from "../user/auth-context";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";

type WikiPermissionContext = {
  canCreate: () => boolean;
  canEdit: () => boolean;
  canDelete: () => boolean;
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
    canCreate: () => wikiAuthor?.key === user?.key,
    canEdit: () => wikiAuthor?.key === user?.key,
    canDelete: () => wikiAuthor?.key === user?.key,
  };
};

export const getWikiPermissionContext = async (wikiKey: string) => {
  return _getWikiPermissionContext({
    authContext: getAuthContext(),
    wikiRepository: getDexieWikiRepository(),
    wikiKey,
  });
};
