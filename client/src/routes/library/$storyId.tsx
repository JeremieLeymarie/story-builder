import { ErrorMessage } from "@/design-system/components";
import { Loader } from "@/design-system/components/loader";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { LibraryGameDetail } from "@/library/detail";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyId } = Route.useParams();
  const story = useLiveQuery(() => getLocalRepository().getStory(storyId));
  const progress = useLiveQuery(() =>
    getLocalRepository().getStoryProgress(storyId)
  );

  if (story === undefined || progress === undefined) {
    return <Loader />;
  }

  if (story === null) {
    return <ErrorMessage text="This page does not exist." />;
  }

  return (
    <div className="h-full w-full">
      <LibraryGameDetail story={story} progress={progress} />
    </div>
  );
};

export const Route = createFileRoute("/library/$storyId")({
  parseParams: ({ storyId }) => {
    return { storyId: parseInt(storyId) };
  },
  component: Page,
});