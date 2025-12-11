import { describe, expect, test, vi } from "vitest";
import {
  _getWikiPermissionContext,
  WikiPermissionContext,
} from "../wiki-permission-context";
import { getStubAuthContext } from "@/domains/user/stubs/stub-auth-context";
import { getStubWikiRepository } from "../stubs/stub-wiki-repository";
import { getTestFactory } from "@/lib/testing/factory";

const factory = getTestFactory();

const expectHasNoPermissions = (context: WikiPermissionContext) => {
  expect(context.canCreateArticle).toBeFalsy();
  expect(context.canDeleteArticle).toBeFalsy();
  expect(context.canEditArticle).toBeFalsy();
  expect(context.canCreateCategory).toBeFalsy();
  expect(context.canEditCategory).toBeFalsy();
  expect(context.canDeleteCategory).toBeFalsy();
};

const expectHasPermissions = (context: WikiPermissionContext) => {
  expect(context.canCreateArticle).toBeTruthy();
  expect(context.canDeleteArticle).toBeTruthy();
  expect(context.canEditArticle).toBeTruthy();
  expect(context.canCreateCategory).toBeTruthy();
  expect(context.canEditCategory).toBeTruthy();
  expect(context.canDeleteCategory).toBeTruthy();
};

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
    expectHasNoPermissions(context);
  });

  test("no permissions when user isn't wiki's author", async () => {
    const user = factory.user({ key: "bob-key", username: "bob-bidou" });
    const wiki = factory.wiki({
      author: { key: "peter-key", username: "peter-key" },
    });

    wikiRepository.get = vi.fn(() => Promise.resolve(wiki));
    authContext.getUser = vi.fn(() => Promise.resolve(user));

    const context = await _getContext();
    expectHasNoPermissions(context);
  });

  test("no permissions when user is not logged in & wiki has author", async () => {
    const wiki = factory.wiki({
      author: { key: "bob-key", username: "bob-bidou" },
    });
    wikiRepository.get = vi.fn(() => Promise.resolve(wiki));
    authContext.getUser = vi.fn(() => Promise.resolve(null));

    const context = await _getContext();
    expectHasNoPermissions(context);
  });

  test("permissions when user is wiki's author and wiki has type `created`", async () => {
    const user = factory.user({ key: "bob-key", username: "bob-bidou" });
    const wiki = factory.wiki({
      author: { key: "bob-key", username: "bob-bidou" },
      type: "created",
    });

    wikiRepository.get = vi.fn(() => Promise.resolve(wiki));
    authContext.getUser = vi.fn(() => Promise.resolve(user));

    const context = await _getContext();
    expectHasPermissions(context);
  });

  test("permissions when user is wiki's author and wiki has type `imported`", async () => {
    const user = factory.user({ key: "bob-key", username: "bob-bidou" });
    const wiki = factory.wiki({
      author: { key: "bob-key", username: "bob-bidou" },
      type: "imported",
    });

    wikiRepository.get = vi.fn(() => Promise.resolve(wiki));
    authContext.getUser = vi.fn(() => Promise.resolve(user));

    const context = await _getContext();
    expectHasNoPermissions(context);
  });

  test("permissions when user is not logged in and wiki has no author and has type `created`", async () => {
    const wiki = factory.wiki({ author: undefined, type: "created" });
    wikiRepository.get = vi.fn(() => Promise.resolve(wiki));
    authContext.getUser = vi.fn(() => Promise.resolve(null));

    const context = await _getContext();
    expectHasPermissions(context);
  });
});
