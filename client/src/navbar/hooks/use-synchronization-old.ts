// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useIsOnline } from "../../hooks/use-is-online";
// import { client } from "@/lib/http-client/client";
// import { adapter } from "@/lib/http-client/adapters";
// import { User } from "@/lib/storage/domain";
// import { getLocalRepository } from "@/repositories/indexed-db-repository";

// export const SYNCHRO_DATETIME_KEY = "LAST_SYNCHRO_AT";

// /**
//  * Use the API to synchronize local data, if connected to network
//  * Synchronize:
//  * - Ongoing games
//  * - Builder games
//  */

// // TODO: test this
// export type SynchronizationState = {
//   isLoading: boolean;
//   success?: boolean;
//   cause?: string;
// };

// // TODO: deprecate this
// export const useSynchronization = ({ user }: { user?: User | null }) => {
//   const repo = useMemo(() => getLocalRepository(), []);
//   const isOnline = useIsOnline();

//   const [synchronizationState, setSynchronizationState] =
//     useState<SynchronizationState>({
//       isLoading: true,
//     });

//   const fetchData = useCallback(async (userKey: string) => {
//     const response = await client.GET("/api/synchronize/{user_key}", {
//       params: { path: { user_key: userKey } },
//     });

//     return response.data ?? null;
//   }, []);

//   const synchronize = useCallback(async () => {
//     // Start loading
//     setSynchronizationState({ isLoading: true });

//     // Fake loading to signify to the user that something is happening
//     await new Promise((res) => setTimeout(res, 500));

//     if (!isOnline) {
//       setSynchronizationState({
//         isLoading: false,
//         success: false,
//         cause: "No internet connection",
//       });
//       sessionStorage.removeItem(SYNCHRO_DATETIME_KEY);
//       return;
//     }

//     if (!user) {
//       setSynchronizationState({
//         isLoading: false,
//         success: false,
//         cause: "User not logged in",
//       });
//       sessionStorage.removeItem(SYNCHRO_DATETIME_KEY);
//       return;
//     }

//     const data = await fetchData(user.key);

//     if (!data) {
//       setSynchronizationState({
//         isLoading: false,
//         success: false,
//         cause: "Unknown issue on our side",
//       });
//       sessionStorage.removeItem(SYNCHRO_DATETIME_KEY);

//       return;
//     }

//     const { builderGames, playerGames, storyProgresses } = data;

//     const { stories, scenes } = adapter.fromAPI.fullStories([
//       ...(builderGames ?? []),
//       ...playerGames,
//     ]);

//     repo.updateOrCreateStories(stories);
//     repo.updateOrCreateScenes(scenes);
//     repo.updateOrCreateStoryProgresses(
//       adapter.fromAPI.storyProgresses(storyProgresses),
//     );

//     // Register that the app is synchronized for this session
//     const syncDateTime = new Date().toISOString();
//     sessionStorage.setItem(SYNCHRO_DATETIME_KEY, syncDateTime);
//     // Dispatch custom event to be able to detect changes anywhere in the app
//     window.dispatchEvent(new StorageEvent("session-storage"));

//     setSynchronizationState({
//       isLoading: false,
//       success: true,
//     });
//   }, [fetchData, isOnline, repo, user]);

//   useEffect(() => {
//     const isSynchronized = !!sessionStorage.getItem(SYNCHRO_DATETIME_KEY);

//     if (isSynchronized) {
//       setSynchronizationState({
//         isLoading: false,
//         success: true,
//       });
//       return;
//     }
//     synchronize();
//   }, [synchronize]);

//   return { state: synchronizationState, synchronize };
// };
