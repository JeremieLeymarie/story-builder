import { StoryProgress } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export const GameLink = ({
  progress,
  gameKey,
  children,
}: PropsWithChildren<{ progress: StoryProgress | null; gameKey: string }>) => {
  if (!progress) {
    return (
      <Link to="/game/$gameKey" params={{ gameKey }}>
        {children}
      </Link>
    );
  }

  /** TODO: we could remove some redundancies by only using the storyProgress key in the URL
   * instead of game + scene + story progress
   **/
  return (
    <Link
      to="/game/$gameKey/$sceneKey"
      params={{ gameKey, sceneKey: progress.currentSceneKey }}
      search={{ storyProgressKey: progress.key }}
    >
      {children}
    </Link>
  );
};
