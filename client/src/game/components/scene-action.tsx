import { Button } from "@/design-system/primitives";
import { Action } from "@/lib/storage/dexie/dexie-db";
import { Link } from "@tanstack/react-router";

export const SceneAction = ({
  text,
  sceneKey,
  storyKey,
}: Action & { storyKey: string }) => {
  if (!sceneKey) {
    // Only show actions that lead somewhere
    return null;
  }

  return (
    <Link
      key={`${text}`}
      to="/game/$gameKey/$sceneKey"
      params={{ gameKey: storyKey, sceneKey }}
    >
      <Button className="w-[full]">{text}</Button>
    </Link>
  );
};
