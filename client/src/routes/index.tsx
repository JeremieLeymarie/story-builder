import { BackdropLoader } from "@/design-system/components";
import { getGameService } from "@/domains/game/game-service";
import { getLibraryService } from "@/domains/game/library-service";
import { getUserService } from "@/domains/user/user-service";
import { Home } from "@/home/home";
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
