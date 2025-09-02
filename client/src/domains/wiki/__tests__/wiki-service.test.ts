import { expect, test, vi, describe, beforeEach } from "vitest";
import {
  getStubWikiRepository,
  getWikiServiceTestContext,
} from "../stubs/stub-wiki-repository";
import { _getWikiService } from "../wiki-service";
import { TEST_USER } from "@/lib/storage/dexie/test-db";
import { getTestFactory } from "@/lib/testing/factory";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import { WikiSection } from "../types";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

const DATE = new Date();

const factory = getTestFactory();

describe("wiki service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("get all wikis", () => {
    test("should return user's wikis", async () => {
      const repository = getStubWikiRepository();

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

      const svc = _getWikiService({
        repository,
        context: getWikiServiceTestContext(),
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
      const repository = getStubWikiRepository();
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

      const svc = _getWikiService({
        repository,
        context: getWikiServiceTestContext(),
      });
      await svc.addAuthorToWikis({ username: "bob_bidou", key: "bob-key" });
    });
  });

  describe("create wiki", () => {
    test("should create wiki", async () => {
      const repository = getStubWikiRepository();

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

      const svc = _getWikiService({
        repository,
        context: getWikiServiceTestContext(),
      });

      await svc.createWiki({
        name: "Wiki",
        description: "Super wiki",
        image: "http://super-image.fr",
      });
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
      const repository = getStubWikiRepository();
      repository.get = vi.fn((key) => {
        expect(key).toStrictEqual(wiki.key);

        return Promise.resolve({ wiki, sections });
      });

      const svc = _getWikiService({
        repository,
        context: getWikiServiceTestContext(),
      });

      const wikiData = await svc.getWikiData(wiki.key);
      expect(wikiData).toStrictEqual({ wiki, sections });
    });
  });

  describe("create wiki article", () => {
    test("should create wiki article without category", async () => {
      const repository = getStubWikiRepository();

      repository.createArticle = vi.fn((wiki) => {
        expect(wiki).toStrictEqual({
          title: "Article",
          content: makeSimpleLexicalContent("content"),
          image: "http://super-image.fr",
          wikiKey: "wiki-key",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return Promise.resolve("KEY");
      });

      const svc = _getWikiService({
        repository,
        context: getWikiServiceTestContext(),
      });

      const key = await svc.createArticle("wiki-key", {
        title: "Article",
        content: makeSimpleLexicalContent("content"),
        image: "http://super-image.fr",
      });
      expect(key).toStrictEqual("KEY");
    });
  });

  describe("get wiki article", () => {
    test("should call repo with correct args", async () => {
      const article = factory.wikiArticle();
      const repository = getStubWikiRepository();
      repository.getArticle = vi.fn((key) => {
        expect(key).toStrictEqual("ZIOUM");

        return Promise.resolve({ ...article, key: "ZIOUM" });
      });

      const svc = _getWikiService({
        repository,
        context: getWikiServiceTestContext(),
      });

      const articleData = await svc.getArticle("ZIOUM");
      expect(articleData).toStrictEqual({ ...article, key: "ZIOUM" });
    });
  });
});
