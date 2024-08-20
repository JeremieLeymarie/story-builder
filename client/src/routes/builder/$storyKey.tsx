import { BuilderContainer } from "@/builder/components/builder-container";
import { BackdropLoader } from "@/design-system/components";
import { getBuilderService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Page = () => {
  const { storyKey } = Route.useParams();
  const builderService = getBuilderService();
  const { scenes, story } =
    useLiveQuery(() => builderService.getBuilderStoryData(storyKey)) ?? {};

  if (!scenes || !story) {
    return <BackdropLoader />;
  }
  return (
    <div className="h-full w-full">
      <BuilderContainer scenes={scenes} story={story} />
    </div>
  );
};

export const Route = createFileRoute("/builder/$storyKey")({
  component: Page,
});
