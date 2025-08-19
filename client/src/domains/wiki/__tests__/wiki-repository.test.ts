import { beforeEach, describe, expect, test } from "vitest";
import {
  _getDexieWikiRepository,
  WikiRepositoryPort,
} from "../wiki-repository";
import { getTestDatabase, TEST_USER } from "@/lib/storage/dexie/test-db";
import { Database } from "@/lib/storage/dexie/dexie-db";
import { Factory, getTestFactory } from "@/lib/testing/factory";

const DATE = new Date();

describe("wiki repository", () => {
  let repo: WikiRepositoryPort;
  let testDB: Database;
  let factory: Factory;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieWikiRepository(testDB);
    factory = getTestFactory();
  });

  describe("get user wikis", () => {
    test("should get all wikis of specified user", async () => {
      const wiki1 = factory.wiki({
        author: { username: TEST_USER.username, key: TEST_USER.key },
        type: "created",
      });
      const wiki2 = factory.wiki({ author: undefined, type: "created" });
      const wiki3 = factory.wiki({
        // Other author
        author: {
          username: "peter_peter",
          key: "peter-peter",
        },
        type: "created",
      });
      const wiki4 = factory.wiki({
        // Imported
        author: { username: TEST_USER.username, key: TEST_USER.key },
        type: "imported",
      });

      const key1 = await testDB.wikis.add(wiki1);
      const key2 = await testDB.wikis.add(wiki2);
      await testDB.wikis.add(wiki3);
      await testDB.wikis.add(wiki4);

      const wikis = await repo.getUserWikis(TEST_USER.key);
      const keys = wikis.map(({ key }) => key);
      expect(wikis).toHaveLength(2);
      expect(keys).toContain(key1);
      expect(keys).toContain(key2);
    });

    test("should get all wikis without account", async () => {
      const wiki1 = await testDB.wikis.add(
        factory.wiki({ author: undefined, type: "created" }),
      );

      // Other author
      await testDB.wikis.add(
        factory.wiki({
          author: {
            username: "peter_peter",
            key: "peter-peter",
          },
          type: "created",
        }),
      );

      const wikis = await repo.getUserWikis(undefined);
      expect(wikis).toHaveLength(1);
      expect(wikis[0]!.key).toStrictEqual(wiki1);
    });
  });

  test("should update wikis correctly", async () => {
    await testDB.wikis.bulkAdd([
      {
        image: "image.fr",
        name: "wiki #1",
        author: { username: TEST_USER.username, key: TEST_USER.key },
        description: "description",
        key: "wiki1-key",
        type: "created",
        createdAt: DATE,
      },
      {
        image: "photo.fr",
        name: "wiki #2",
        author: undefined,
        description: "vrouuuum",
        key: "wiki2-key",
        type: "imported",
        createdAt: DATE,
      },
      {
        image: "avion.png",
        name: "wiki #3",
        author: { username: TEST_USER.username, key: TEST_USER.key },
        description: "pas modifié",
        key: "wiki3-key",
        type: "created",
        createdAt: DATE,
      },
    ]);
    expect(await testDB.wikis.toArray()).toHaveLength(3);

    await repo.bulkUpdate([
      {
        key: "wiki1-key",
        description: "une autre description",
        name: "coucou",
      },
      {
        key: "wiki2-key",
        author: { key: "peter-key", username: "peter_peter" },
      },
      {
        key: "wiki4-key", // Does not exist
        name: "tutu",
      },
      { key: "wiki3-key" },
    ]);

    const wikis = await testDB.wikis.toArray();

    expect(wikis).toHaveLength(3);
    expect(wikis).toContainEqual({
      image: "image.fr",
      name: "coucou",
      author: { username: TEST_USER.username, key: TEST_USER.key },
      description: "une autre description",
      key: "wiki1-key",
      type: "created",
      createdAt: DATE,
    });
    expect(wikis).toContainEqual({
      image: "photo.fr",
      name: "wiki #2",
      author: { key: "peter-key", username: "peter_peter" },
      description: "vrouuuum",
      key: "wiki2-key",
      type: "imported",
      createdAt: DATE,
    });
    expect(wikis).toContainEqual({
      image: "avion.png",
      name: "wiki #3",
      author: { username: TEST_USER.username, key: TEST_USER.key },
      description: "pas modifié",
      key: "wiki3-key",
      type: "created",
      createdAt: DATE,
    });
  });

  test("should not authorize same wiki multiple times", async () => {
    expect(
      async () =>
        await repo.bulkUpdate([{ key: "a" }, { key: "b" }, { key: "a" }]),
    ).rejects.toThrowError("Each wiki can only be present once in the input");
  });

  describe("create", () => {
    test("should create wiki", async () => {
      const existingWiki = factory.wiki();
      await testDB.wikis.add(existingWiki);

      const wikiToAdd = factory.wiki();
      const wikiKey = await repo.create(wikiToAdd);

      const allWikis = await testDB.wikis.toArray();
      expect(allWikis).toHaveLength(2);
      expect(await testDB.wikis.get(wikiKey)).toStrictEqual({
        ...wikiToAdd,
        key: wikiKey,
      });
    });
  });
});
