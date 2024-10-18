import { BuilderContainer } from "@/builder/components/builder-container";
import { getBuilderService } from "@/services";
import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const Page = () => {
  const { storyKey } = Route.useParams();
  const builderService = getBuilderService();
  const { data, isLoading, refetch } = useQuery({
    queryFn: () => builderService.getBuilderStoryData(storyKey),
    queryKey: ["builder-story-data"],
  });

  if (isLoading || !data) {
    return <BackdropLoader />;
  }

  const { scenes, story } = data;

  if (!story) {
    return <ErrorMessage />;
  }

  return (
    <div className="h-full w-full">
      <BuilderContainer scenes={scenes} story={story} refresh={refetch} />
    </div>
  );
};

export const Route = createFileRoute("/builder/$storyKey")({
  component: Page,
});
