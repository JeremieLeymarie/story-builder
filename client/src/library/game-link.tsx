import { StoryProgress } from "@/lib/storage/dexie/dexie-db";
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

  return (
    <Link
      to="/game/$gameKey/$sceneKey"
      params={{ gameKey, sceneKey: progress.currentSceneKey }}
    >
      {children}
    </Link>
  );
};
