import { Builder } from "@/builder/components/builder";
import { Loader } from "@/design-system/components/loader";
import { getBuilderService } from "@/services/builder";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyKey } = Route.useParams();
  const builderService = getBuilderService();
  const { scenes, story } =
    useLiveQuery(() => builderService.getBuilderData(storyKey)) ?? {};

  if (!scenes || !story) {
    return <Loader />;
  }
  return (
    <div className="h-full w-full">
      <Builder scenes={scenes} story={story} />
    </div>
  );
};

export const Route = createFileRoute("/builder/$storyKey")({
  component: Page,
});
