import {
  getLocalRepository,
  getRemoteAPIRepository,
  LocalRepositoryPort,
  RemoteRepositoryPort,
} from "@/repositories";
import { checkCanPerformSync } from "./common/sync";

const _getSyncService = ({
  remoteRepository,
  localRepository,
}: {
  remoteRepository: RemoteRepositoryPort;
  localRepository: LocalRepositoryPort;
}) => {
  return {
    getSynchronizationData: async () => {
      const user = await localRepository.getUser();
      const { canSync, error } = checkCanPerformSync(user);

      if (!canSync) {
        return { success: false, error };
      }

      const response = await remoteRepository.getSynchronizationData(user!.key);

      if (!response.data) {
        return { success: false, error: response.error };
      }

      // TODO: use services to sync
    },
  };
};

export const getSyncService = () =>
  _getSyncService({
    remoteRepository: getRemoteAPIRepository(),
    localRepository: getLocalRepository(),
  });
