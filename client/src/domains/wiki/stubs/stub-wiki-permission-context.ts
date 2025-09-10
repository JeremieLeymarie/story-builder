import { vi } from "vitest";
import { WikiPermissionContext } from "../wiki-permission-context";
import { MockPort } from "@/types";

type StubWikiPermissionContext = MockPort<WikiPermissionContext>;

export const getStubWikiPermissionContextFactory =
  ({
    canCreateArticle,
    canDeleteArticle,
    canEditArticle,
  }: Partial<Record<keyof WikiPermissionContext, boolean>> = {}) =>
  async (): Promise<StubWikiPermissionContext> =>
    Promise.resolve({
      canCreateArticle: vi.fn(() => canCreateArticle ?? true),
      canDeleteArticle: vi.fn(() => canDeleteArticle ?? true),
      canEditArticle: vi.fn(() => canEditArticle ?? true),
    });
