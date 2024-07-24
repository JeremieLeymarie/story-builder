import { Entity } from "@/lib/storage/domain";
import { getLocalRepository } from "./indexed-db-repository";
import { LocalRepositoryPort } from "./local-repository-port";
import { getRemoteAPIRepository } from "./remote-api-repository";
import {
  RemoteRepositoryPort,
  RemoteRepositoryResponse,
} from "./remote-repository-port";
import { RepositoryPort } from "./repository-port";

const isOnline = () => {
  return navigator.onLine;
};

const LOCAL_STORAGE_SYNC_KEY = "unsynchronized_entities";

const registerUnsyncEntities = (entitiesToAdd: Entity[]) => {
  const entities = new Set(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_SYNC_KEY) ?? "[]"),
  );
  entitiesToAdd.forEach((entity) => entities.add(entity));

  localStorage.setItem(LOCAL_STORAGE_SYNC_KEY, JSON.stringify([...entities]));
  window.dispatchEvent(new StorageEvent("local-storages"));
};

// TODO: think of a way to do transactions outside of repositories
const _getRepository = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}): RepositoryPort => {
  const ensureSync = async <TFunc extends () => unknown>(
    entities: Entity[],
    fn: TFunc,
  ) => {
    const user = await localRepository.getUser();

    if (!isOnline()) {
      registerUnsyncEntities(entities);
      return { error: "Network unreachable", data: undefined };
    }

    if (!user) {
      registerUnsyncEntities(entities);
      return { error: "User not logged in", data: undefined };
    }

    const response = await fn();
    if ((response as RemoteRepositoryResponse).error) {
      registerUnsyncEntities(entities);
    }

    return response as ReturnType<TFunc>;
  };

  return {
    updateScene: async (key, scene) => {
      localRepository.updateScene(key, scene);

      ensureSync(["story"], () =>
        remoteRepository.updatePartialScene(key, scene),
      );
    },

    // TODO: Figure out a way to avoid leaking business logic in repository for transactional changes
    createStoryWithFirstScene: async (story, scene) => {
      const result = await localRepository.createStoryWithFirstScene({
        story,
        firstScene: scene,
      });

      if (result)
        ensureSync(["story"], () => {
          remoteRepository.updateOrCreateScene(result.scene);
          remoteRepository.updateOrCreateStory(result.story);
        });

      return result;
    },

    getUser: () => {
      return localRepository.getUser();
    },
  };
};

const repository = _getRepository({
  localRepository: getLocalRepository(),
  remoteRepository: getRemoteAPIRepository(),
});

export const getRepository = () => {
  return repository;
};
