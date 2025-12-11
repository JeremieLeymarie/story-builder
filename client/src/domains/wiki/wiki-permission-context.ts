import { AuthContextPort, getAuthContext } from "../user/auth-context";
import { getDexieWikiRepository, WikiRepositoryPort } from "./wiki-repository";

export type WikiPermissionContext = {
  canCreateArticle: boolean;
  canEditArticle: boolean;
  canDeleteArticle: boolean;
  canCreateCategory: boolean;
  canEditCategory: boolean;
  canDeleteCategory: boolean;
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
  const wiki = await wikiRepository.get(wikiKey);

  const isCreatedByMe = wiki?.author?.key === user?.key;

  return {
    canCreateArticle: isCreatedByMe && wiki?.type === "created",
    canEditArticle: isCreatedByMe && wiki?.type === "created",
    canDeleteArticle: isCreatedByMe && wiki?.type === "created",
    canCreateCategory: isCreatedByMe && wiki?.type === "created",
    canEditCategory: isCreatedByMe && wiki?.type === "created",
    canDeleteCategory: isCreatedByMe && wiki?.type === "created",
  };
};

export const getWikiPermissionContext = async (wikiKey: string) => {
  return _getWikiPermissionContext({
    authContext: getAuthContext(),
    wikiRepository: getDexieWikiRepository(),
    wikiKey,
  });
};
