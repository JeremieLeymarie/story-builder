import { Loader } from "@/design-system/components";
import { Home } from "@/home/home";
import { useIsOnline } from "@/hooks/use-is-online";
import { adapter } from "@/lib/http-client/adapters";
import { client } from "@/lib/http-client/client";
import { Story } from "@/lib/storage/dexie/dexie-db";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

const Index = () => {
  const repo = getLocalRepository();
  const user = useLiveQuery(() => repo.getUser());
  const lastPlayedGame = useLiveQuery(() => repo.getLastGamePlayed(), [user]);
  const [storeItems, setStoreItems] = useState<Story[] | null>(null);
  const isOnline = useIsOnline();

  // repo.createStory({ key: "coucou" });

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    // TODO: request only necessary number of items
    client.GET("/api/store/load").then((res) => {
      if (res.error || !res.data) {
        setStoreItems(null);
      } else {
        setStoreItems(adapter.fromAPI.stories(res.data.slice(0, 3)));
      }
    });
  }, [isOnline]);

  if (user === undefined || lastPlayedGame === undefined) {
    return <Loader />;
  }

  return <Home lastPlayedGame={lastPlayedGame} storeItems={storeItems} />;
};

export const Route = createFileRoute("/")({
  component: Index,
});
