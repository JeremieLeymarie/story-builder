import { beforeEach, describe, expect, test } from "vitest";
import { getTestDatabase } from "@/lib/storage/dexie/test-db";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { getTestFactory } from "@/lib/testing/factory";
import { _getDexieBuilderStoryRepository } from "../builder-story-repository";
import { _getDexieBuilderSceneRepository } from "../builder-scene-repository";
import {
  _getDexieThemeRepository,
  ThemeRepositoryPort,
} from "../theme-repository";

const factory = getTestFactory();

describe("story theme repository", () => {
  let repo: ThemeRepositoryPort;
  let testDB: DexieDatabase;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieThemeRepository(testDB);
  });

  describe("get", () => {
    test("should return null if not exists", async () => {
      const result = await repo.get("plouf");
      expect(result).toBeNull();
    });

    test("should get using storyKey", async () => {
      const theme = factory.storyTheme();
      await testDB.storyThemes.add(theme);

      const result = await repo.get(theme.storyKey);

      expect(result).toStrictEqual(theme);
    });
  });

  describe("create", () => {
    test("should throw if a theme already exists for story key", async () => {
      await testDB.storyThemes.add(
        factory.storyTheme({ storyKey: "story-key" }),
      );

      await expect(
        repo.create(factory.storyTheme({ storyKey: "story-key" })),
      ).rejects.toThrow();
    });

    test("should add to DB", async () => {
      const theme = factory.storyTheme({ key: undefined });
      await repo.create(theme);

      expect(await repo.get(theme.storyKey)).toStrictEqual({
        ...theme,
        key: expect.anything(),
      });
    });
  });

  describe("update", () => {
    test("should throw when trying to set already used story key", async () => {
      const theme = factory.storyTheme({ storyKey: "story-1" });
      await repo.create(theme);
      await repo.create(factory.storyTheme({ storyKey: "story-2" }));

      await expect(
        repo.update(theme.storyKey, { ...theme, storyKey: "story-2" }),
      ).rejects.toThrow();
    });

    test("should update", async () => {
      const theme1 = factory.storyTheme();
      const theme2 = factory.storyTheme();
      await repo.create(theme1);
      await repo.create(theme2);

      await repo.update(theme1.storyKey, {
        theme: {
          ...theme1.theme,
          title: { ...theme1.theme.title, color: "blue" },
        },
      });

      expect(await repo.get(theme1.storyKey)).toStrictEqual({
        ...theme1,
        theme: {
          ...theme1.theme,
          title: { ...theme1.theme.title, color: "blue" },
        },
      });
      expect(await repo.get(theme2.storyKey)).toStrictEqual(theme2); // Unchanged
    });
  });
});
