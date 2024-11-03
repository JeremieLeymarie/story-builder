import { Loader } from "@/design-system/components";
import { Home } from "@/home/home";
import { Story } from "@/lib/storage/domain";
import { getGameService, getLibraryService, getUserService } from "@/services";
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
  const libraryStories = useLiveQuery(getLibraryService().getLibrary);

  useEffect(() => {
    getStoreService().getFirstItems(10).then(setStoreItems);
  }, []);

  if (
    user === undefined ||
    lastPlayedGame === undefined ||
    libraryStories === undefined
  ) {
    return <Loader />;
  }

  return (
    <Home
      lastPlayedGame={lastPlayedGame}
      storeItems={storeItems}
      libraryStories={libraryStories.games}
    />
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
