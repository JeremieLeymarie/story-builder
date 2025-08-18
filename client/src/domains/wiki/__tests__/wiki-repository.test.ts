import { beforeEach, describe, expect, test } from "vitest";
import {
  _getDexieWikiRepository,
  WikiRepositoryPort,
} from "../wiki-repository";
import { getTestDatabase, TEST_USER } from "@/lib/storage/dexie/test-db";
import { Database } from "@/lib/storage/dexie/dexie-db";

describe("wiki repository", () => {
  let repo: WikiRepositoryPort;
  let testDB: Database;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieWikiRepository(testDB);
  });

  test("should get all wikis of specified user", async () => {
    const wiki1 = await testDB.wikis.add({
      image: "image.fr",
      name: "wiki #1",
      author: { username: TEST_USER.username, key: TEST_USER.key },
      description: "description",
    });
    const wiki2 = await testDB.wikis.add({
      image: "photo.fr",
      name: "wiki #2",
      author: undefined,
      description: "vrouuuum",
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
    });

    const wikis = await repo.getUserWikis(TEST_USER.key);
    expect(wikis).toHaveLength(2);
    expect(wikis).toContainEqual({
      image: "image.fr",
      name: "wiki #1",
      author: { username: TEST_USER.username, key: TEST_USER.key },
      description: "description",
      key: wiki1,
    });
    expect(wikis).toContainEqual({
      image: "photo.fr",
      name: "wiki #2",
      author: undefined,
      description: "vrouuuum",
      key: wiki2,
    });
  });

  test("should get all wikis without account", async () => {
    const wiki1 = await testDB.wikis.add({
      image: "image.fr",
      name: "wiki #1",
      author: undefined,
      description: "description",
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
    });

    const wikis = await repo.getUserWikis(undefined);
    expect(wikis).toHaveLength(1);
    expect(wikis).toContainEqual({
      image: "image.fr",
      name: "wiki #1",
      author: undefined,
      description: "description",
      key: wiki1,
    });
  });
});
