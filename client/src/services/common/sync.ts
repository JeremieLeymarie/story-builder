import { SyncableEntity, User } from "@/lib/storage/domain";
import { LocalRepositoryPort } from "@/repositories/local-repository-port";
import { RemoteRepositoryResponse } from "@/repositories/remote-repository-port";

const LOCAL_STORAGE_SYNC_KEY = "unsynchronized_entities";

export const isOnline = () => {
  return navigator.onLine;
};

export const registerUnsyncEntities = (entitiesToAdd: SyncableEntity[]) => {
  const entities = new Set(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_SYNC_KEY) ?? "[]"),
  );
  entitiesToAdd.forEach((entity) => entities.add(entity));

  localStorage.setItem(LOCAL_STORAGE_SYNC_KEY, JSON.stringify([...entities]));
  window.dispatchEvent(new StorageEvent("local-storage"));
};

export const checkCanPerformSync = (user: User | null) => {
  if (!isOnline()) {
    return { error: "Network unreachable", canSync: false };
  }

  if (!user) {
    return { error: "User not logged in", canSync: false };
  }

  return { canSync: true, error: undefined };
};

export const makePerformSync = (localRepository: LocalRepositoryPort) => {
  /**
   * Try to sync data using the passed function. If it fails (i.e user is offline or not logged in), register that the entity is not synchronized
   * @param entities the entities to synchronize
   * @param fn the synchronization function
   * @returns A object containing the error or data
   */
  const _performSync = async <TFunc extends () => unknown>(
    entities: SyncableEntity[],
    fn: TFunc,
  ) => {
    const user = await localRepository.getUser();
    const { canSync, error } = await checkCanPerformSync(user);

    if (!canSync) {
      registerUnsyncEntities(entities);
      return { error, data: undefined };
    }

    const response = await fn();
    if ((response as RemoteRepositoryResponse).error) {
      registerUnsyncEntities(entities);
    }

    return response as ReturnType<TFunc>;
  };

  return _performSync;
};
