import {
  getLocalRepository,
  getRemoteAPIRepository,
  LocalRepositoryPort,
  RemoteRepositoryPort,
} from "@/repositories";
import { isOnline } from "./common/sync";

const _getStoreService = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}) => {
  return {
    getItems: async () => {
      if (!isOnline()) return null;
      // TODO: request only necessary number of items
      const response = await remoteRepository.getStoreItems();
      if (response.data) return response.data;
      return null;
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
