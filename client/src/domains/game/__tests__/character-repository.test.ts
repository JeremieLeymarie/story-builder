import { beforeEach, describe, expect, test } from "vitest";
import { getTestDatabase } from "@/lib/storage/dexie/test-db";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { getTestFactory } from "@/lib/testing/factory";
import {
  _getDexieCharacterRepository,
  CharacterRepositoryPort,
} from "../character-repository";

const factory = getTestFactory();

describe("game character repository", () => {
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
});
