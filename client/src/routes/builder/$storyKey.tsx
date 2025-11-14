import { BuilderContainer } from "@/builder/components/builder-container";
import { useGetBuilder } from "@/builder/hooks/use-get-builder";
import { useBuilderEditorStore } from "@/builder/hooks/use-scene-editor-store";
import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { createFileRoute } from "@tanstack/react-router";

const Page = () => {
  const { storyKey } = Route.useParams();
  const { story, scenes, isLoading, refetch } = useGetBuilder({ storyKey });

  if (isLoading) {
    return <BackdropLoader />;
  }

  if (!story || !scenes) {
    return <ErrorMessage />;
  }

  return (
    <div className="h-full w-full">
      <BuilderContainer
        scenes={scenes}
        story={story}
        refresh={async () => {
          refetch();
        }}
      />
    </div>
  );
};

export const Route = createFileRoute("/builder/$storyKey")({
  component: Page,
  onLeave: () => {
    useBuilderEditorStore.setState({ editor: null });
  },
});
