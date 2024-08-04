import { Loader } from "@/design-system/components";
import { Home } from "@/home/home";
import { Story } from "@/lib/storage/domain";
import { getGameService, getUserService } from "@/services";
import { getStoreService } from "@/services/store-service";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

const Index = () => {
  const userService = getUserService();
  const gameService = getGameService();
  const user = useLiveQuery(userService.getCurrentUser);
  const lastPlayedGame = useLiveQuery(gameService.getLastGamePlayed, [user]);
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
