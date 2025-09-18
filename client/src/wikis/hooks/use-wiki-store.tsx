/* eslint-disable react-refresh/only-export-components */
import { createStore } from "zustand";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { WikiData } from "@/domains/wiki/types";
import { WikiPermissionContext } from "@/domains/wiki/wiki-permission-context";

type WikiState = {
  refresh: () => Promise<void>;
  wikiData: WikiData;
  permissions: WikiPermissionContext;
};

type WikiProviderProps = Pick<
  WikiState,
  "wikiData" | "refresh" | "permissions"
>;

const createWikiStore = ({
  refresh,
  wikiData,
  permissions,
}: WikiProviderProps) => {
  return createStore<WikiState>()(() => ({
    refresh,
    wikiData,
    permissions,
  }));
};

type WikiStore = ReturnType<typeof createWikiStore>;

const WikiContext = createContext<WikiStore | null>(null);

export const WikiProvider = ({
  children,
  refresh,
  wikiData,
  permissions,
}: WikiProviderProps & { children: ReactNode }) => {
  const storeRef = useRef<WikiStore>(
    createWikiStore({ refresh, wikiData, permissions }),
  );

  useEffect(() => {
    storeRef.current = createWikiStore({ refresh, wikiData, permissions });
  }, [refresh, wikiData, permissions]);

  return (
    <WikiContext.Provider value={storeRef.current}>
      {children}
    </WikiContext.Provider>
  );
};

export const useWikiStore = <T,>(selector: (state: WikiState) => T): T => {
  const store = useContext(WikiContext);
  if (!store)
    throw new Error(
      "useWikiStore must be used within a WikiProvider. Did you forget to wrap your component in a WikiProvider?",
    );

  return useStoreWithEqualityFn(store, selector, shallow);
};
