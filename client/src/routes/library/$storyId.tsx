import { Loader } from "@/design-system/components/loader";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyId } = Route.useParams();
  const story = useLiveQuery(() => getLocalRepository().getStory(storyId));

  if (!story) {
    return <Loader />;
  }
  return <div className="h-full w-full">TODO</div>;
};

export const Route = createFileRoute("/library/$storyId")({
  parseParams: ({ storyId }) => {
    return { storyId: parseInt(storyId) };
  },
  component: Page,
});
