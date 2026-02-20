import { beforeEach, describe, expect, test } from "vitest";
import { getTestDatabase } from "@/lib/storage/dexie/test-db";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { getTestFactory } from "@/lib/testing/factory";
import { _getDexieBuilderStoryRepository } from "../builder-story-repository";
import { _getDexieBuilderSceneRepository } from "../builder-scene-repository";
import {
  _getDexieCharacterRepository,
  CharacterRepositoryPort,
} from "../character-repository";

const factory = getTestFactory();

describe("story character repository", () => {
  let repo: CharacterRepositoryPort;
  let testDB: DexieDatabase;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieCharacterRepository(testDB);
  });

  describe("get", () => {
    test("should return null if not exists", async () => {
      const result = await repo.get("plouf");
      expect(result).toBeNull();
    });

    test("should get using storyKey", async () => {
      const character = factory.characterConfig();
      await testDB.characterConfigurations.add(character);

      const result = await repo.get(character.storyKey);

      expect(result).toStrictEqual(character);
    });
  });

  describe("create", () => {
    test("should throw if a character already exists for story key", async () => {
      await testDB.characterConfigurations.add(
        factory.characterConfig({ storyKey: "story-key" }),
      );

      await expect(
        repo.create(factory.characterConfig({ storyKey: "story-key" })),
      ).rejects.toThrow();
    });

    test("should add to DB", async () => {
      const character = factory.characterConfig({ key: undefined });
      await repo.create(character);

      expect(await repo.get(character.storyKey)).toStrictEqual({
        ...character,
        key: expect.anything(),
      });
    });
  });

  describe("update", () => {
    test("should throw when trying to set already used story key", async () => {
      const character = factory.characterConfig({ storyKey: "story-1" });
      await repo.create(character);
      await repo.create(factory.characterConfig({ storyKey: "story-2" }));

      await expect(
        repo.update(character.storyKey, { ...character, storyKey: "story-2" }),
      ).rejects.toThrow();
    });

    test("should update", async () => {
      const character1 = factory.characterConfig({
        attributes: {
          "force-key": {
            key: "force-key",
            type: "numeric",
            name: "force",
            description: "desc",
            initialValue: 10,
            isEditableByPlayer: false,
            visibility: "visible",
          },
        },
      });
      const character2 = factory.characterConfig();
      await repo.create(character1);
      await repo.create(character2);

      await repo.update(character1.storyKey, {
        ...character1,
        attributes: {
          "force-key": {
            key: "force-key",
            type: "numeric",
            name: "force",
            description: "desc",
            initialValue: 10,
            isEditableByPlayer: true, // Only modified field
            visibility: "visible",
          },
          // New attribute
          "dex-key": {
            key: "dex-key",
            type: "numeric",
            name: "dex",
            description: "pschitt",
            initialValue: 5,
            isEditableByPlayer: false,
            visibility: "invisible",
          },
        },
      });

      expect(await repo.get(character1.storyKey)).toStrictEqual({
        ...character1,
        attributes: {
          "force-key": {
            key: "force-key",
            name: "force",
            description: "desc",
            initialValue: 10,
            isEditableByPlayer: true, // Only modified field
            visibility: "visible",
          },
          // New attribute
          "dex-key": {
            key: "dex-key",
            name: "dex",
            description: "pschitt",
            initialValue: 5,
            isEditableByPlayer: false,
            visibility: "invisible",
          },
        },
      });
      expect(await repo.get(character2.storyKey)).toStrictEqual(character2); // Unchanged
    });
  });

  describe("delete", () => {
    test("should throw if not exists", async () => {
      await expect(repo.delete("plouf")).rejects.toThrow();
    });

    test("should delete character config", async () => {
      const cc = factory.characterConfig({ key: "ploc", storyKey: "story-a" });
      const cc2 = factory.characterConfig({ key: "bis", storyKey: "story-b" });
      await testDB.characterConfigurations.bulkAdd([cc, cc2]);

      await repo.delete("story-a");

      console.log(await testDB.characterConfigurations.toArray());

      expect(await testDB.characterConfigurations.get("ploc")).toBeUndefined();
      expect(
        await testDB.characterConfigurations.get("bis"),
      ).not.toBeUndefined();
    });
  });
});
