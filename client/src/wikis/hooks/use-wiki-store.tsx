/* eslint-disable react-refresh/only-export-components */
import { createStore } from "zustand";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { WikiData } from "@/domains/wiki/types";

type WikiState = {
  refresh: () => Promise<void>;
  wikiData: WikiData;
};

type WikiProviderProps = Pick<WikiState, "wikiData" | "refresh">;

const createWikiStore = ({ refresh, wikiData }: WikiProviderProps) => {
  return createStore<WikiState>()(() => ({
    refresh,
    wikiData,
  }));
};

type WikiStore = ReturnType<typeof createWikiStore>;

const WikiContext = createContext<WikiStore | null>(null);

export const WikiProvider = ({
  children,
  refresh,
  wikiData,
}: WikiProviderProps & { children: ReactNode }) => {
  const storeRef = useRef<WikiStore>(createWikiStore({ refresh, wikiData }));

  useEffect(() => {
    storeRef.current = createWikiStore({ refresh, wikiData });
  }, [refresh, wikiData]);

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
