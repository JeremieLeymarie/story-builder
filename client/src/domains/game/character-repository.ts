import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { CharacterConfiguration } from "@/lib/storage/domain";

export type CharacterRepositoryPort = {
  get: (storyKey: string) => Promise<CharacterConfiguration | null>;
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

  return { get };
};

export const getDexieCharacterRepository = () =>
  _getDexieCharacterRepository(db);
