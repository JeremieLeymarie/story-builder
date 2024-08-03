import {
  getLocalRepository,
  getRemoteAPIRepository,
  LocalRepositoryPort,
  RemoteRepositoryPort,
} from "@/repositories";

const _getGameService = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}) => {
  return {
    saveProgress: () => {},
  };
};

export const getGameService = () =>
  _getGameService({
    localRepository: getLocalRepository(),
    remoteRepository: getRemoteAPIRepository(),
  });
