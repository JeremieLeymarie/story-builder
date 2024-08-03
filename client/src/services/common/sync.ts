import { Entity } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { RemoteRepositoryResponse } from "@/repositories/remote-repository-port";

const LOCAL_STORAGE_SYNC_KEY = "unsynchronized_entities";

export const isOnline = () => {
  return navigator.onLine;
};

export const registerUnsyncEntities = (entitiesToAdd: Entity[]) => {
  const entities = new Set(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_SYNC_KEY) ?? "[]"),
  );
  entitiesToAdd.forEach((entity) => entities.add(entity));

  localStorage.setItem(LOCAL_STORAGE_SYNC_KEY, JSON.stringify([...entities]));
  window.dispatchEvent(new StorageEvent("local-storage"));
};

export const makePerformSync = (localRepository: LocalRepositoryPort) => {
  /**
   * Try to sync data using the passed function. If it fails (i.e user is offline or not logged in), register that the entity is not synchronized
   * @param entities the entities to synchronize
   * @param fn the synchronization function
   * @returns A object containing the error or data
   */
  const _performSync = async <TFunc extends () => unknown>(
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

  return _performSync;
};
