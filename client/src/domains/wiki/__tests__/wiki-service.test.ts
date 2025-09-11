import { expect, test, vi, describe, beforeEach } from "vitest";
import { getStubWikiRepository } from "../stubs/stub-wiki-repository";
import { _getWikiService } from "../wiki-service";
import { TEST_USER } from "@/lib/storage/dexie/test-db";
import { getTestFactory } from "@/lib/testing/factory";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import { WikiSection } from "../types";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { EntityNotExistError, ForbiddenError } from "@/domains/errors";
import { getStubAuthContext } from "@/domains/user/stubs/stub-auth-context";
import { getStubWikiPermissionContextFactory } from "../stubs/stub-wiki-permission-context";
import { WikiCategoryNameTaken } from "../errors";

const DATE = new Date();

const factory = getTestFactory();
const repository = getStubWikiRepository();
const svc = _getWikiService({
  repository,
  authContext: getStubAuthContext(TEST_USER),
  getPermissionContext: getStubWikiPermissionContextFactory(),
});

describe("wiki service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("get all wikis", () => {
    test("should return user's wikis", async () => {
      repository.getUserWikis = vi.fn((userKey) => {
        expect(userKey).toStrictEqual(TEST_USER.key);

        return Promise.resolve([
          {
            image: "image.fr",
            name: "wiki #1",
            author: { username: "bob_bidou", key: "userKey" },
            description: "description",
            key: "key",
            type: "created" as const,
            createdAt: DATE,
          },
        ]);
      });

      const wikis = await svc.getAllWikis();

      expect(wikis).toHaveLength(1);
      expect(wikis).toContainEqual({
        image: "image.fr",
        name: "wiki #1",
        author: { username: "bob_bidou", key: "userKey" },
        description: "description",
        key: "key",
        type: "created",
        createdAt: DATE,
      });
    });
  });

  describe("add author to wikis", () => {
    test("should update wikis", async () => {
      repository.getUserWikis = vi.fn((userKey) => {
        expect(userKey).toStrictEqual(TEST_USER.key);

        return Promise.resolve([
          {
            image: "image.fr",
            name: "wiki #1",
            author: { username: "bob_bidou", key: "userKey" },
            description: "description",
            key: "key-1",
            type: "created" as const,
            createdAt: DATE,
          },
          {
            image: "photo.fr",
            name: "wiki #2",
            author: undefined,
            description: "other description",
            key: "key-2",
            type: "created" as const,
            createdAt: DATE,
          },
          {
            image: "photo.fr",
            name: "Imported wiki",
            author: undefined,
            description: "tutu",
            key: "key-3",
            type: "imported" as const,
            createdAt: DATE,
          },
        ]);
      });

      repository.bulkUpdate = vi.fn((payload) => {
        expect(payload).toStrictEqual([
          { key: "key-2", author: { username: "bob_bidou", key: "bob-key" } },
        ]);

        return Promise.resolve();
      });

      await svc.addAuthorToWikis({ username: "bob_bidou", key: "bob-key" });
    });
  });

  describe("create wiki", () => {
    test("should create wiki", async () => {
      repository.create = vi.fn((wiki) => {
        expect(wiki).toStrictEqual({
          name: "Wiki",
          description: "Super wiki",
          image: "http://super-image.fr",
          createdAt: new Date(),
          type: "created",
          author: { username: TEST_USER.username, key: TEST_USER.key },
        });

        return Promise.resolve("KEY");
      });

      await svc.createWiki({
        name: "Wiki",
        description: "Super wiki",
        image: "http://super-image.fr",
      });
      expect(repository.createCategory).toHaveBeenCalledTimes(4); // Four default categories have been created
    });
  });

  describe("get wiki", () => {
    test("should call repo with correct args", async () => {
      const wiki = factory.wiki();
      const sections: WikiSection[] = [
        {
          category: factory.wikiCategory(),
          articles: [{ title: faker.book.title(), key: nanoid() }],
        },
      ];

      repository.get = vi.fn((key) => {
        expect(key).toStrictEqual(wiki.key);
        return Promise.resolve(wiki);
      });
      repository.getSections = vi.fn((key) => {
        expect(key).toStrictEqual(wiki.key);
        return Promise.resolve(sections);
      });

      const wikiData = await svc.getWikiData(wiki.key);
      expect(wikiData).toStrictEqual({ wiki, sections });
    });
  });

  describe("create wiki article", () => {
    test("no perms", async () => {
      const svc = _getWikiService({
        repository,
        authContext: getStubAuthContext(TEST_USER),
        getPermissionContext: getStubWikiPermissionContextFactory({
          canCreateArticle: false,
        }),
      });

      await expect(
        svc.createArticle("key", factory.wikiArticle()),
      ).rejects.toThrow(ForbiddenError);
    });

    test("should create wiki article", async () => {
      repository.createArticle = vi.fn((article) => {
        expect(article).toStrictEqual({
          title: "Article",
          content: makeSimpleLexicalContent("content"),
          image: "http://super-image.fr",
          wikiKey: "wiki-key",
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryKey: "category-key",
        });

        return Promise.resolve("KEY");
      });

      const key = await svc.createArticle("wiki-key", {
        title: "Article",
        content: makeSimpleLexicalContent("content"),
        image: "http://super-image.fr",
        categoryKey: "category-key",
      });
      expect(key).toStrictEqual("KEY");
    });
  });

  describe("update wiki article", () => {
    test("no perms", async () => {
      const svc = _getWikiService({
        repository,
        authContext: getStubAuthContext(TEST_USER),
        getPermissionContext: getStubWikiPermissionContextFactory({
          canEditArticle: false,
        }),
      });

      await expect(svc.updateArticle("tutu", {})).rejects.toThrow(
        ForbiddenError,
      );
    });

    test("should update wiki article", async () => {
      repository.updateArticle = vi.fn(async (key, payload) => {
        expect(key).toStrictEqual("article-key");
        expect(payload).toStrictEqual({
          title: "another title",
          categoryKey: "cat-key",
        });
      });

      await svc.updateArticle("article-key", {
        title: "another title",
        categoryKey: "cat-key",
      });
    });

    test("should throw error for invalid article key", async () => {
      repository.getArticle = vi.fn(() => {
        return Promise.resolve(null);
      });

      await expect(
        svc.updateArticle("article-key", {
          title: "another title",
          categoryKey: "cat-key",
        }),
      ).rejects.toThrowError(EntityNotExistError);
    });
  });

  describe("get wiki article", () => {
    test("should call repo with correct args", async () => {
      const article = factory.wikiArticle();

      repository.getArticle = vi.fn((key) => {
        expect(key).toStrictEqual("ZIOUM");

        return Promise.resolve({ ...article, key: "ZIOUM" });
      });

      const articleData = await svc.getArticle("ZIOUM");
      expect(articleData).toStrictEqual({ ...article, key: "ZIOUM" });
    });
  });

  describe("create wiki category", () => {
    test("no perms", async () => {
      const svc = _getWikiService({
        repository,
        authContext: getStubAuthContext(TEST_USER),
        getPermissionContext: getStubWikiPermissionContextFactory({
          canCreateCategory: false,
        }),
      });

      await expect(
        svc.createCategory("key", factory.wikiCategory()),
      ).rejects.toThrow(ForbiddenError);
    });

    test("should fail if category already exists with same name", async () => {
      repository.getSections = vi.fn(() =>
        Promise.resolve([
          {
            category: { name: "Plouf", key: "cat-key", color: "red" },
            articles: [],
          },
        ]),
      );

      await expect(
        svc.createCategory("wiki-key", { color: "green", name: "Plouf" }),
      ).rejects.toThrow(WikiCategoryNameTaken);
    });

    test("should create wiki category", async () => {
      repository.createCategory = vi.fn((category) => {
        expect(category).toStrictEqual({
          name: "Category",
          color: "#EFCB68",
          wikiKey: "wiki-key",
        });

        return Promise.resolve("KEY");
      });

      const key = await svc.createCategory("wiki-key", {
        name: "Category",
        color: "#EFCB68",
      });
      expect(key).toStrictEqual("KEY");
    });
  });
});
