import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { CharacterConfiguration } from "@/lib/storage/domain";
import { MaybeWithoutKey } from "@/types";
import { EntityNotExistError } from "../errors";

export type CharacterRepositoryPort = {
  get: (storyKey: string) => Promise<CharacterConfiguration | null>;
  create: (payload: MaybeWithoutKey<CharacterConfiguration>) => Promise<string>;
  update: (
    storyKey: string,
    payload: Partial<CharacterConfiguration>,
  ) => Promise<void>;
  delete: (storyKey: string) => Promise<void>;
};

export const _getDexieCharacterRepository = (
  db: DexieDatabase,
): CharacterRepositoryPort => {
  const get = async (storyKey: string) => {
    const characters = await db.characterConfigurations
      .filter((character) => character.storyKey === storyKey)
      .toArray();

    return characters[0] ?? null;
  };

  return {
    get,

    create: async (payload) => {
      return await db.characterConfigurations.add(payload);
    },

    update: async (storyKey, payload) => {
      await db.characterConfigurations.where({ storyKey }).modify(payload);
    },

    delete: async (storyKey) => {
      const characterConfig = await get(storyKey);
      if (!characterConfig)
        throw new EntityNotExistError("character-configuration", { storyKey });
      await db.characterConfigurations.where({ storyKey }).delete();
    },
  };
};

export const getDexieCharacterRepository = () =>
  _getDexieCharacterRepository(db);
