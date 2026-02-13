import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { getLibraryService } from "@/domains/game/library-service";
import { LibraryGameDetail } from "@/library/game-detail";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyKey } = Route.useParams();
  const { story, currentProgress, otherProgresses } =
    useLiveQuery(() => getLibraryService().getGameDetail(storyKey)) ?? {};

  if (
    story === undefined ||
    currentProgress === undefined ||
    otherProgresses === undefined
  ) {
    return <BackdropLoader />;
  }

  if (story === null || currentProgress === null) {
    return <ErrorMessage>This page does not exist.</ErrorMessage>;
  }

  return (
    <div className="h-full w-full">
      <LibraryGameDetail
        story={story}
        currentProgress={currentProgress}
        otherProgresses={otherProgresses}
      />
    </div>
  );
};

export const Route = createFileRoute("/library/$storyKey")({
  component: Page,
});
