import { Builder } from "@/components/builder/builder";
import { Loader } from "@/design-system/components/loader";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyId } = Route.useParams();
  const scenes = useLiveQuery(() => getRepository().getScenes(storyId));

  if (!scenes) {
    return <Loader />;
  }
  return (
    <div className="h-full w-full">
      <Builder storyId={storyId} scenes={scenes} />
    </div>
  );
};

export const Route = createFileRoute("/builder/$storyId")({
  parseParams: ({ storyId }) => {
    return { storyId: parseInt(storyId) };
  },
  component: Page,
});
