import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { StoryTheme } from "@/lib/storage/domain";
import { MaybeWithoutKey } from "@/types";

export type ThemeRepositoryPort = {
  get: (storyKey: string) => Promise<StoryTheme | null>;
  create: (payload: MaybeWithoutKey<StoryTheme>) => Promise<void>;
  update: (storyKey: string, payload: Partial<StoryTheme>) => Promise<void>;
};

export const _getDexieThemeRepository = (
  db: DexieDatabase,
): ThemeRepositoryPort => {
  return {
    get: async (storyKey: string) => {
      const themes = await db.storyThemes
        .filter((theme) => theme.storyKey === storyKey)
        .toArray();

      return themes[0] ?? null;
    },

    create: async (payload) => {
      await db.storyThemes.add(payload);
    },

    update: async (storyKey, payload) => {
      await db.storyThemes.where({ storyKey }).modify(payload);
    },
  };
};

export const getDexieThemeRepository = (): ThemeRepositoryPort => {
  return _getDexieThemeRepository(db);
};
