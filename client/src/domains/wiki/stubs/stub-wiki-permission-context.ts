import { WikiPermissionContext } from "../wiki-permission-context";

export const getStubWikiPermissionContextFactory =
  (mockedCtx: Partial<WikiPermissionContext> = {}) =>
  async (): Promise<WikiPermissionContext> =>
    Promise.resolve({
      canCreateArticle: mockedCtx.canCreateArticle ?? true,
      canRemoveArticle: mockedCtx.canRemoveArticle ?? true,
      canEditArticle: mockedCtx.canEditArticle ?? true,
      canCreateCategory: mockedCtx.canCreateCategory ?? true,
      canEditCategory: mockedCtx.canEditCategory ?? true,
      canDeleteCategory: mockedCtx.canDeleteCategory ?? true,
    });
