import { getTestFactory } from "@/lib/testing/factory";
import { beforeEach, describe, expect, test } from "vitest";
import {
  _getDexieUserRepository,
  UserRepositoryPort,
} from "../user-repository";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { getTestDatabase, TEST_USER } from "@/lib/storage/dexie/test-db";
import { TooManyUsersError } from "../errors";

const factory = getTestFactory();

describe("user repository", () => {
  let repo: UserRepositoryPort;
  let testDB: DexieDatabase;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieUserRepository(testDB);
  });

  describe("get current user", () => {
    test("should get current user", async () => {
      const user = await repo.getCurrent();
      expect(user).toStrictEqual(TEST_USER);
    });

    test("should throw if there are too many users", async () => {
      const user = factory.user();
      await testDB.user.add(user);
      await expect(repo.getCurrent()).rejects.toThrowError(TooManyUsersError);
    });

    test("should return null when no user is logged in", async () => {
      await testDB.user.clear();
      const user = await repo.getCurrent();
      expect(user).toBeNull();
    });
  });
});
