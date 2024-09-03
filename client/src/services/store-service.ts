import { getRemoteAPIRepository, RemoteRepositoryPort } from "@/repositories";
import { isOnline } from "./common/sync";
import { Story, StoryGenre } from "@/lib/storage/domain";

// Is this replaceable?
const _getStoreService = ({
  remoteRepository,
}: {
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
  };
};

export const getStoreService = () =>
  _getStoreService({
    remoteRepository: getRemoteAPIRepository(),
  });
