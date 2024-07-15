import { StoryProgress } from "@/lib/storage/dexie/dexie-db";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export const GameLink = ({
  progress,
  gameId,
  children,
}: PropsWithChildren<{ progress: StoryProgress | null; gameId: number }>) => {
  if (!progress) {
    return (
      <Link to="/game/$gameId" params={{ gameId }}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      to="/game/$gameId/$sceneId"
      params={{ gameId, sceneId: progress.currentSceneId }}
    >
      {children}
    </Link>
  );
};
