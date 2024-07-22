import { useCallback, useEffect, useState } from "react";
import { useIsOnline } from "./use-is-online";
import { client } from "@/lib/http-client/client";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { fromAPIstoriesAdapter } from "@/lib/http-client/adapters";
import { User } from "@/lib/storage/dexie/dexie-db";

export const SYNCHRO_STORAGE_KEY = "IS_SYNCHRONIZED";

/**
 * Use the API to synchronize local data, if connected to network
 * Synchronize:
 * - Ongoing games
 * - Builder games
 */

// TODO: test this

export type SynchronizationState = {
  isLoading: boolean;
  success?: boolean;
  cause?: string;
};
export const useSynchronization = ({ user }: { user?: User | null }) => {
  const repo = getLocalRepository();
  const isOnline = useIsOnline();
  const [synchronizationState, setSynchronizationState] =
    useState<SynchronizationState>({
      isLoading: true,
    });
  const isSynchronized = sessionStorage.getItem(SYNCHRO_STORAGE_KEY) === "1";

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
        setSynchronizationState({
          isLoading: false,
          success: false,
          cause: "Unknown issue on our side",
        });
        return;
      }

      const { builderGames, playerGames } = data;

      repo.updateOrCreateStories([
        ...(builderGames ? fromAPIstoriesAdapter(builderGames) : []),
        ...fromAPIstoriesAdapter(playerGames),
      ]);
      // Register that the app is synchronized for this session
      sessionStorage.setItem(SYNCHRO_STORAGE_KEY, "1");
      setSynchronizationState({
        isLoading: false,
        success: true,
      });
    },
    [fetchData, repo],
  );

  useEffect(() => {
    if (!isOnline) {
      setSynchronizationState({
        isLoading: false,
        success: false,
        cause: "No internet connection",
      });
      return;
    }

    if (!user) {
      setSynchronizationState({
        isLoading: false,
        success: false,
        cause: "User not logged in",
      });
      return;
    }
    if (isSynchronized) {
      setSynchronizationState({
        isLoading: false,
        success: true,
      });
      return;
    }

    synchronize(user.key);
  }, [isOnline, isSynchronized, synchronize, user]);

  return synchronizationState;
};
