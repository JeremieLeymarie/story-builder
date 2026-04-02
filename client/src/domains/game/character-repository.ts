import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { CharacterConfiguration } from "@/lib/storage/domain";

export type CharacterRepositoryPort = {
  getConfig: (storyKey: string) => Promise<CharacterConfiguration | null>;
};

export const _getDexieCharacterRepository = (
  db: DexieDatabase,
): CharacterRepositoryPort => {
  const getConfig = async (storyKey: string) => {
    const characters = await db.characterConfigurations
      .filter((character) => character.storyKey === storyKey)
      .toArray();

    return characters[0] ?? null;
  };

  return { getConfig };
};

export const getDexieCharacterRepository = () =>
  _getDexieCharacterRepository(db);
