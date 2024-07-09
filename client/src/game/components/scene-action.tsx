import { Button } from "@/design-system/primitives";
import { Action } from "@/lib/storage/dexie/dexie-db";
import { Link } from "@tanstack/react-router";

export const SceneAction = ({
  text,
  sceneId,
  storyId,
}: Action & { storyId: number }) => {
  if (!sceneId) {
    // Only show actions that lead somewhere
    return null;
  }

  return (
    <Link
      key={`${text}`}
      to="/game/$gameId/$sceneId"
      params={{ gameId: storyId, sceneId }}
    >
      <Button className="w-[full]">{text}</Button>
    </Link>
  );
};
