import { describe, expect, test, vi } from "vitest";
import { _getWikiPermissionContext } from "../wiki-permission-context";
import { getStubAuthContext } from "@/domains/user/stubs/stub-auth-context";
import { getStubWikiRepository } from "../stubs/stub-wiki-repository";
import { getTestFactory } from "@/lib/testing/factory";

const factory = getTestFactory();

describe("wiki permission context", async () => {
  const wikiRepository = getStubWikiRepository();
  const authContext = getStubAuthContext();

  const _getContext = async () =>
    await _getWikiPermissionContext({
      wikiKey: "tutu",
      authContext,
      wikiRepository,
    });

  test("no permissions when wiki doesn't exist", async () => {
    wikiRepository.get = vi.fn(() => Promise.resolve(null));
    const context = await _getContext();
    expect(context.canCreate()).toBeFalsy();
    expect(context.canDelete()).toBeFalsy();
    expect(context.canEdit()).toBeFalsy();
  });

  test("no permissions when user isn't wiki's author", async () => {
    const user = factory.user({ key: "bob-key", username: "bob-bidou" });
    const wiki = factory.wiki({
      author: { key: "peter-key", username: "peter-key" },
    });

    wikiRepository.get = vi.fn(() => Promise.resolve({ wiki, sections: [] }));
    authContext.getUser = vi.fn(() => Promise.resolve(user));

    const context = await _getContext();
    expect(context.canCreate()).toBeFalsy();
    expect(context.canDelete()).toBeFalsy();
    expect(context.canEdit()).toBeFalsy();
  });

  test("no permissions when user is not logged in & wiki has author", async () => {
    const wiki = factory.wiki({
      author: { key: "bob-key", username: "bob-bidou" },
    });
    wikiRepository.get = vi.fn(() => Promise.resolve({ wiki, sections: [] }));
    authContext.getUser = vi.fn(() => Promise.resolve(null));

    const context = await _getContext();
    expect(context.canCreate()).toBeFalsy();
    expect(context.canDelete()).toBeFalsy();
    expect(context.canEdit()).toBeFalsy();
  });

  test("permissions when user is wiki's author", async () => {
    const user = factory.user({ key: "bob-key", username: "bob-bidou" });
    const wiki = factory.wiki({
      author: { key: "bob-key", username: "bob-bidou" },
    });

    wikiRepository.get = vi.fn(() => Promise.resolve({ wiki, sections: [] }));
    authContext.getUser = vi.fn(() => Promise.resolve(user));

    const context = await _getContext();
    expect(context.canCreate()).toBeTruthy();
    expect(context.canDelete()).toBeTruthy();
    expect(context.canEdit()).toBeTruthy();
  });

  test("permissions when user is not logged in and wiki has no author", async () => {
    const wiki = factory.wiki({ author: undefined });
    wikiRepository.get = vi.fn(() => Promise.resolve({ wiki, sections: [] }));
    authContext.getUser = vi.fn(() => Promise.resolve(null));

    const context = await _getContext();
    expect(context.canCreate()).toBeTruthy();
    expect(context.canDelete()).toBeTruthy();
    expect(context.canEdit()).toBeTruthy();
  });
});
