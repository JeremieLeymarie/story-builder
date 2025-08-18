import { describe } from "node:test";
import { expect, test, vi } from "vitest";
import {
  getStubWikiRepository,
  getWikiServiceTestContext,
} from "../stubs/stub-wiki-repository";
import { _getWikiService } from "../wiki-service";
import { TEST_USER } from "@/lib/storage/dexie/test-db";

describe("wiki service", () => {
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
