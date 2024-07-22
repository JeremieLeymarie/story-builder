import { useCallback, useEffect, useState } from "react";
import { useIsOnline } from "./use-is-online";
import { Story, User } from "@/lib/storage/dexie/dexie-db";
import { client } from "@/lib/http-client/client";

export const SYNCHRO_STORAGE_KEY = "IS_SYNCHRONIZED";

/**
 * Use the API to synchronize local data, if connected to network
 * Synchronize:
 * - Ongoing games
 * - Builder games
 */

export const useSynchronization = ({ user }: { user: User | null }) => {
  const isOnline = useIsOnline();
  const [synchronizationState, setSynchronizationState] = useState<boolean>();
  const isSynchronized = sessionStorage.getItem(SYNCHRO_STORAGE_KEY) === "1";

  const fetchData = useCallback(async (userKey: string) => {
    const response = await client.GET("/api/synchronize/{user_key}", {
      params: { path: { user_key: userKey } },
    });

    return response.data ?? null;
  }, []);

  const sync = useCallback(
    async (userKey: string) => {
      const data = await fetchData(userKey);

      if (!data) {
        setSynchronizationState(false);
        return;
      }

      const { builderGames, playerGames } = data;

      // Register that the app is synchronized for this session
      sessionStorage.setItem(SYNCHRO_STORAGE_KEY, "1");
    },
    [fetchData],
  );

  useEffect(() => {
    if (isOnline && !isSynchronized && user) {
      sync(user.key);
    }
  }, [isOnline, isSynchronized, sync, user]);

  return synchronizationState;
};
