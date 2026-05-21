import { _getDexieWikiRepository } from "@/domains/wiki/wiki-repository";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { getTestDatabase } from "@/lib/storage/dexie/test-db";
import { getTestFactory } from "@/lib/testing/factory";
import { beforeEach, describe, expect, test } from "vitest";
import {
  _getDexieProgressRepository,
  ProgressRepositoryPort,
} from "../progress-repository";

const factory = getTestFactory();

describe("progress-repository", () => {
  let repo: ProgressRepositoryPort;
  let testDB: DexieDatabase;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieProgressRepository(testDB);
  });

  describe("get progress", () => {
    test("returns null if it does not exist", async () => {
      const progress = factory.storyProgress();
      await testDB.storyProgresses.add(progress);

      const result = await repo.get("boum");

      expect(result).toBeNull();
    });

    test("returns progress", async () => {
      const progresses = [
        factory.storyProgress({ key: "boum" }),
        factory.storyProgress(),
      ];
      await testDB.storyProgresses.bulkAdd(progresses);

      const result = await repo.get("boum");

      expect(result).toStrictEqual(progresses[0]);
    });
  });

  describe("update progress", () => {
    test("should update progress", async () => {
      const [progressA, progressB] = [
        factory.storyProgress({ history: [] }),
        factory.storyProgress(),
      ];
      await testDB.storyProgresses.bulkAdd([progressA, progressB]);

      await repo.update(progressA.key, { history: ["scene-key"] });

      expect(await testDB.storyProgresses.get(progressA.key)).toStrictEqual({
        ...progressA,
        history: ["scene-key"],
      });
      expect(await testDB.storyProgresses.get(progressB.key)).toStrictEqual(
        progressB,
      );
    });
  });
});
