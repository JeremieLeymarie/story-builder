import { WikiBar } from "./wiki-bar";
import { ReactNode, useEffect, useEffectEvent } from "react";
import { WikiSearch } from "./wiki-search";
import { useWikiStore } from "./hooks/use-wiki-store";
import { match } from "ts-pattern";
import { getUserOS } from "@/lib/get-os";
import { isAnyInputFocused } from "@/lib/shortcuts";

const useWikiShortCuts = () => {
  const openSearch = useWikiStore((state) => state.openSearch);

  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const isCtrlOrMeta = getUserOS() === "Mac" ? e.metaKey : e.ctrlKey;

    if (!isCtrlOrMeta || isAnyInputFocused()) return;

    match(e).with({ key: "k" }, () => {
      openSearch();
    });
  });

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

export const WikiContainer = ({ children }: { children: ReactNode }) => {
  useWikiShortCuts();

  return (
    <div className="relative flex h-full gap-4 p-4">
      <WikiBar />
      <div className="w-full">{children}</div>
      <WikiSearch />
    </div>
  );
};
