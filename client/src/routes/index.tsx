import { Loader } from "@/design-system/components";
import { Home } from "@/home/home";
import { Story } from "@/lib/storage/domain";
import { getLocalRepository } from "@/repositories/indexed-db-repository";
import { getStoreService } from "@/services/store-service";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

const Index = () => {
  const repo = getLocalRepository();
  const user = useLiveQuery(() => repo.getUser());
  const lastPlayedGame = useLiveQuery(() => repo.getLastGamePlayed(), [user]);
  const [storeItems, setStoreItems] = useState<Story[] | null>(null);

  useEffect(() => {
    getStoreService().getItems().then(setStoreItems);
  }, []);

  if (user === undefined || lastPlayedGame === undefined) {
    return <Loader />;
  }

  return <Home lastPlayedGame={lastPlayedGame} storeItems={storeItems} />;
};

export const Route = createFileRoute("/")({
  component: Index,
});
