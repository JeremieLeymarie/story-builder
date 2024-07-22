import { useCallback, useEffect, useState } from "react";
import { useIsOnline } from "./use-is-online";
import { User } from "@/lib/storage/dexie/dexie-db";
import { client } from "@/lib/http-client/client";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { fromAPIstoriesAdapter } from "@/lib/http-client/adapters";

export const SYNCHRO_STORAGE_KEY = "IS_SYNCHRONIZED";

/**
 * Use the API to synchronize local data, if connected to network
 * Synchronize:
 * - Ongoing games
 * - Builder games
 */

// TODO: test this
export const useSynchronization = ({ user }: { user: User | null }) => {
  const isOnline = useIsOnline();
  const [synchronizationState, setSynchronizationState] = useState<boolean>();
  const isSynchronized = sessionStorage.getItem(SYNCHRO_STORAGE_KEY) === "1";
  const repo = getLocalRepository();

  const fetchData = useCallback(async (userKey: string) => {
    const response = await client.GET("/api/synchronize/{user_key}", {
      params: { path: { user_key: userKey } },
    });

    return response.data ?? null;
  }, []);

  const synchronize = useCallback(
    async (userKey: string) => {
      const data = await fetchData(userKey);

      if (!data) {
        setSynchronizationState(false);
        return;
      }

      const { builderGames, playerGames } = data;

      repo.updateOrCreateStories([
        ...(builderGames ? fromAPIstoriesAdapter(builderGames) : []),
        ...fromAPIstoriesAdapter(playerGames),
      ]);
      // Register that the app is synchronized for this session
      sessionStorage.setItem(SYNCHRO_STORAGE_KEY, "1");
      setSynchronizationState(true);
    },
    [fetchData, repo],
  );

  useEffect(() => {
    if (!isOnline || !user) {
      setSynchronizationState(false);
      return;
    }
    if (isSynchronized) {
      setSynchronizationState(true);
      return;
    }

    synchronize(user.key);
  }, [isOnline, isSynchronized, synchronize, user]);

  return synchronizationState;
};
