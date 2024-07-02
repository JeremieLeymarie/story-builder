import { Builder } from "@/builder/components/builder";
import { Loader } from "@/design-system/components/loader";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyId } = Route.useParams();
  const scenes = useLiveQuery(() => getLocalRepository().getScenes(storyId));
  const story = useLiveQuery(() => getLocalRepository().getStory(storyId));

  if (!scenes || !story) {
    return <Loader />;
  }
  return (
    <div className="h-full w-full">
      <Builder scenes={scenes} story={story} />
    </div>
  );
};

export const Route = createFileRoute("/builder/$storyId")({
  parseParams: ({ storyId }) => {
    return { storyId: parseInt(storyId) };
  },
  component: Page,
});
