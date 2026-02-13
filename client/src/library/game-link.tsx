import { StoryProgress } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export const GameLink = ({
  progress,
  gameKey,
  children,
  disabled = false,
}: PropsWithChildren<{
  progress: StoryProgress;
  gameKey: string;
  disabled?: boolean;
}>) => {
  if (disabled) return children;
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
