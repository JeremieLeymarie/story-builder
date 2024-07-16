import { API_URL } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { useIsOnline } from "./use-is-online";
import { Story } from "@/lib/storage/dexie/dexie-db";

export const SYNCHRO_STORAGE_KEY = "IS_SYNCHRONIZED";

type SynchronizationData = {
  playerGames: Story[];
  builderStories: Story[] | null;
};

/**
 * Use the API to synchronize local data, if connected to network
 * Synchronize:
 * - Ongoing games
 * - Builder games
 */

export const useSynchronization = () => {
  const isOnline = useIsOnline();
  //   const [synchronized, setSynchronized] = useState(false);
  const isSynchronized = sessionStorage.getItem(SYNCHRO_STORAGE_KEY) === "1";

  const sync = useCallback((data: SynchronizationData) => {}, []);

  const fetchData = useCallback(async () => {
    const raw = await fetch(`${API_URL}`);
    const res = await raw.json();
  }, []);

  useEffect(() => {
    if (isOnline && !isSynchronized) {
      fetchData();
    }
  }, [fetchData, isOnline, isSynchronized]);

  //   return synchronized;
};
