import { DexieDatabase, db } from "@/lib/storage/dexie/dexie-db";
import { InvalidStoryTypeError } from "./errors";
import { BuilderStoryRepositoryPort } from "./ports/builder-story-repository-port";
import { EntityNotExistError } from "../errors";

export const _getDexieBuilderStoryRepository = (
  db: DexieDatabase,
): BuilderStoryRepositoryPort => {
  const _getBuilderStory = async (key: string) => {
    const story = await db.stories.get(key);
    if (!story) return null;
    if (story.type !== "builder") {
      throw new InvalidStoryTypeError(story.type);
    }

    return story;
  };

  return {
    update: async (key: string, partialStory) => {
      const story = await _getBuilderStory(key);
      if (!story) throw new EntityNotExistError("story", key);

      await db.stories.update(key, partialStory);

      const updated = await _getBuilderStory(key);
      if (!updated) throw new EntityNotExistError("story", key);
      return updated;
    },

    get: _getBuilderStory,
  };
};

export const getDexieBuilderStoryRepository =
  (): BuilderStoryRepositoryPort => {
    return _getDexieBuilderStoryRepository(db);
  };
