import { describe } from "node:test";
import { expect, test, vi } from "vitest";
import {
  getStubWikiRepository,
  getWikiServiceTestContext,
} from "../stubs/stub-wiki-repository";
import { _getWikiService } from "../wiki-service";
import { TEST_USER } from "@/lib/storage/dexie/test-db";

describe("wiki service", () => {
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
          },
          {
            image: "photo.fr",
            name: "wiki #2",
            author: undefined,
            description: "other description",
            key: "key-2",
            type: "created" as const,
          },
          {
            image: "photo.fr",
            name: "Imported wiki",
            author: undefined,
            description: "tutu",
            key: "key-3",
            type: "imported" as const,
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
});
