import {
  getLocalRepository,
  getRemoteAPIRepository,
  LocalRepositoryPort,
  RemoteRepositoryPort,
} from "@/repositories";
import { isOnline } from "./common/sync";
import { Story, StoryGenre } from "@/lib/storage/domain";

const _getStoreService = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}) => {
  return {
    getItemsByGenre: async () => {
      if (!isOnline()) return null;
      // TODO: request only necessary number of items
      const response = await remoteRepository.getStoreItems();

      if (response.data) {
        const storiesByGenre = response.data.reduce(
          (acc, story) => {
            story.genres.forEach((genre) => {
              acc[genre] = acc[genre] ? [...acc[genre], story] : [story];
            });

            return acc;
          },
          {} as Record<StoryGenre, Story[]>,
        );

        return { storiesByGenre };
      }
      return null;
    },

    getFirstItems: async (numberOfItems: number) => {
      if (!isOnline()) return null;
      // TODO: request only necessary number of items
      const response = await remoteRepository.getStoreItems();

      return response.data?.slice(0, numberOfItems) ?? null;
    },

    downloadStory: async (storyKey: string) => {
      if (!isOnline()) return false;
      const { data } = await remoteRepository.downloadStory(storyKey);

      if (data) {
        await localRepository.createStory(data.story);
        await localRepository.createScenes(data.scenes);
        return true;
      }

      return false;
    },
  };
};

export const getStoreService = () =>
  _getStoreService({
    localRepository: getLocalRepository(),
    remoteRepository: getRemoteAPIRepository(),
  });
