import { beforeEach, describe, expect, test } from "vitest";
import {
  _getDexieWikiRepository,
  WikiRepositoryPort,
} from "../wiki-repository";
import { getTestDatabase, TEST_USER } from "@/lib/storage/dexie/test-db";
import { Database } from "@/lib/storage/dexie/dexie-db";

const DATE = new Date();

describe("wiki repository", () => {
  let repo: WikiRepositoryPort;
  let testDB: Database;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieWikiRepository(testDB);
  });

  describe("get user wikis", () => {
    test("should get all wikis of specified user", async () => {
      const wiki1 = await testDB.wikis.add({
        image: "image.fr",
        name: "wiki #1",
        author: { username: TEST_USER.username, key: TEST_USER.key },
        description: "description",
        type: "created",
        createdAt: DATE,
      });
      const wiki2 = await testDB.wikis.add({
        image: "photo.fr",
        name: "wiki #2",
        author: undefined,
        description: "vrouuuum",
        type: "created",
        createdAt: DATE,
      });
      // Other author
      await testDB.wikis.add({
        image: "wallpaper.fr",
        name: "wiki #3",
        author: {
          username: "peter_peter",
          key: "peter-peter",
        },
        description: "pas mon wiki",
        type: "created",
        createdAt: DATE,
      });
      // Imported wiki
      await testDB.wikis.add({
        image: "wallpaper.fr",
        name: "wiki #4",
        author: { username: TEST_USER.username, key: TEST_USER.key },
        description: "mon wiki, mais importé, pas créé",
        type: "imported",
        createdAt: DATE,
      });

      const wikis = await repo.getUserWikis(TEST_USER.key);
      expect(wikis).toHaveLength(2);
      expect(wikis).toContainEqual({
        image: "image.fr",
        name: "wiki #1",
        author: { username: TEST_USER.username, key: TEST_USER.key },
        description: "description",
        key: wiki1,
        type: "created",
        createdAt: DATE,
      });
      expect(wikis).toContainEqual({
        image: "photo.fr",
        name: "wiki #2",
        author: undefined,
        description: "vrouuuum",
        key: wiki2,
        type: "created",
        createdAt: DATE,
      });
    });

    test("should get all wikis without account", async () => {
      const wiki1 = await testDB.wikis.add({
        image: "image.fr",
        name: "wiki #1",
        author: undefined,
        description: "description",
        type: "created",
        createdAt: DATE,
      });
      // Other author
      await testDB.wikis.add({
        image: "wallpaper.fr",
        name: "wiki #2",
        author: {
          username: "peter_peter",
          key: "peter-peter",
        },
        description: "pas mon wiki",
        type: "created",
        createdAt: DATE,
      });

      const wikis = await repo.getUserWikis(undefined);
      expect(wikis).toHaveLength(1);
      expect(wikis).toContainEqual({
        image: "image.fr",
        name: "wiki #1",
        author: undefined,
        description: "description",
        key: wiki1,
        type: "created",
        createdAt: DATE,
      });
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
});
