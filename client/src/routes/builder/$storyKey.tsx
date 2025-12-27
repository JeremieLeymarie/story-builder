import { BuilderContainer } from "@/builder/components/builder-container";
import {
  makeGetBuilderQueryOptions,
  useGetBuilder,
} from "@/builder/hooks/use-get-builder";
import { useBuilderEditorStore } from "@/builder/hooks/use-builder-editor-store";
import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "../__root";

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
  onLeave: ({ params: { storyKey } }) => {
    queryClient.invalidateQueries({
      queryKey: makeGetBuilderQueryOptions({ storyKey }).queryKey,
    });
    useBuilderEditorStore.setState({ editor: null });
  },
});
