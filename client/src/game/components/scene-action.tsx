import { Button } from "@/design-system/primitives";
import { Action } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";

export const SceneAction = ({
  action: { text, sceneKey },
  progressKey,
  storyKey,
}: {
  action: Action;
  progressKey: string | null;
  storyKey: string;
}) => {
  if (!sceneKey) {
    // Only show actions that lead somewhere
    return null;
  }

  const button = (
    <Button className="h-max text-left text-wrap whitespace-normal">
      {text}
    </Button>
  );

  // This corresponds to test mode
  if (!progressKey)
    return (
      <Link
        key={`${text}`}
        to="/game/test/$gameKey/$sceneKey"
        params={{ gameKey: storyKey, sceneKey }}
      >
        {button}
      </Link>
    );

  return (
    <Link
      key={`${text}`}
      to="/game/$gameKey/$sceneKey"
      params={{ gameKey: storyKey, sceneKey }}
      search={{ storyProgressKey: progressKey }}
    >
      {button}
    </Link>
  );
};
