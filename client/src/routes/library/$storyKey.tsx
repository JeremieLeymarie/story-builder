import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { LibraryGameDetail } from "@/library/detail";
import { getLibraryService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyKey } = Route.useParams();
  const { story, progress, lastScene } =
    useLiveQuery(() => getLibraryService().getLibraryDetail(storyKey)) ?? {};

  if (
    story === undefined ||
    progress === undefined ||
    lastScene === undefined
  ) {
    return <BackdropLoader />;
  }

  if (story === null) {
    return <ErrorMessage text="This page does not exist." />;
  }

  return (
    <div className="h-full w-full">
      <LibraryGameDetail
        story={story}
        progress={progress}
        currentScene={lastScene}
      />
    </div>
  );
};

export const Route = createFileRoute("/library/$storyKey")({
  component: Page,
});
