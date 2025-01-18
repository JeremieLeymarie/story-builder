import { BackdropLoader } from "@/design-system/components";
import { Home } from "@/home/home";
import { getGameService, getLibraryService, getUserService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Index = () => {
  const userService = getUserService();
  const gameService = getGameService();
  const user = useLiveQuery(userService.getCurrentUser);
  const lastPlayedGame = useLiveQuery(gameService.getLastGamePlayed, [user]);
  const libraryStories = useLiveQuery(getLibraryService().getLibrary);

  if (
    user === undefined ||
    lastPlayedGame === undefined ||
    libraryStories === undefined
  ) {
    return <BackdropLoader />;
  }

  return (
    <Home
      lastPlayedGame={lastPlayedGame}
      libraryStories={libraryStories.games}
    />
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
