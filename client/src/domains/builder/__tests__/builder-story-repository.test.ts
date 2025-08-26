import { beforeEach, describe, expect, test } from "vitest";
import { getTestDatabase } from "@/lib/storage/dexie/test-db";
import { Database } from "@/lib/storage/dexie/dexie-db";
import { getTestFactory } from "@/lib/testing/factory";
import { BuilderStoryRepositoryPort } from "../ports/builder-story-repository-port";
import { _getDexieBuilderStoryRepository } from "../builder-story-repository";
import { InvalidStoryTypeError } from "../errors";
import { EntityNotExistError } from "@/domains/errors";

const factory = getTestFactory();

describe("builder story repository", () => {
  let repo: BuilderStoryRepositoryPort;
  let testDB: Database;

  const storyA = factory.story.builder();
  const storyB = factory.story.builder();
  const storyC = factory.story.library();

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieBuilderStoryRepository(testDB);

    // basic seed
    await testDB.stories.bulkAdd([storyA, storyB, storyC]);
  });

  describe("get builder story", () => {
    test("should return null when story doesn't exist", async () => {
      const story = await repo.get("schplong");
      expect(story).toStrictEqual(null);
    });

    test("should throw when story type is not 'builder'", async () => {
      const storyPromise = repo.get(storyC.key);
      await expect(storyPromise).rejects.toThrowError(
        new InvalidStoryTypeError("imported"),
      );
    });

    test("should get builder story", async () => {
      const story = await repo.get(storyB.key);
      expect(story).toStrictEqual(storyB);
    });
  });

  describe("update builder story", () => {
    test("should throw when given invalid key", async () => {
      await expect(repo.update("schplong", {})).rejects.toThrowError(
        new EntityNotExistError("story", "schplong"),
      );
    });

    test("should throw when story type is not builder", async () => {
      await expect(repo.update(storyC.key, {})).rejects.toThrowError(
        new InvalidStoryTypeError("imported"),
      );
    });

    test("should partially update story", async () => {
      await repo.update(storyB.key, {
        author: { key: "key", username: "bob_bidou" },
        title: "A new title",
      });

      const story = await testDB.stories.get(storyB.key);

      expect(story).toStrictEqual({
        ...storyB,
        author: { key: "key", username: "bob_bidou" },
        title: "A new title",
      });
    });
  });
});
