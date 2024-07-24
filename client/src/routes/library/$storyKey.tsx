import { ErrorMessage } from "@/design-system/components";
import { Loader } from "@/design-system/components/loader";
import { LibraryGameDetail } from "@/library/detail";
import { getLocalRepository } from "@/repositories/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyKey } = Route.useParams();
  const repo = getLocalRepository();
  const story = useLiveQuery(() => repo.getStory(storyKey));
  const progress = useLiveQuery(() => repo.getStoryProgress(storyKey));
  const lastScene = useLiveQuery(
    () => (progress ? repo.getScene(progress.currentSceneKey) : progress),
    [progress],
  );

  if (
    story === undefined ||
    progress === undefined ||
    lastScene === undefined
  ) {
    return <Loader />;
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
