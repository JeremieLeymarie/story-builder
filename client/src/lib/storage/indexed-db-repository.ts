import { WithoutId } from "@/types";
import { Story, db } from "./dexie-db";
import { IndexedDBRepositoryPort } from "./port";

class IndexedDBRepository implements IndexedDBRepositoryPort {
  createStory = async (story: WithoutId<Story>) => {
    const id = await db.stories.add(story);
    return { ...story, id };
  };
  // TODO: actually implement other methods
}

const repository = new IndexedDBRepository();
export const getRepository = () => {
  return repository;
};
