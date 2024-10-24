import { Button } from "@/design-system/primitives";
import { Action } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";

export const SceneAction = ({
  action: { text, sceneKey },
  progressKey,
  storyKey,
}: {
  action: Action;
  progressKey: string;
  storyKey: string;
}) => {
  if (!sceneKey) {
    // Only show actions that lead somewhere
    return null;
  }

  return (
    <Link
      key={`${text}`}
      to="/game/$gameKey/$sceneKey"
      params={{ gameKey: storyKey, sceneKey }}
      search={{ storyProgressKey: progressKey }}
    >
      <Button className="w-[full]">{text}</Button>
    </Link>
  );
};
