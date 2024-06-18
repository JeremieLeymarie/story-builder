import { Builder } from "@/components/builder/builder";
import { createFileRoute } from "@tanstack/react-router";

const Page = () => {
  const { storyId } = Route.useParams();

  return (
    <div className="h-full w-full">
      <Builder storyId={storyId} />
    </div>
  );
};

export const Route = createFileRoute("/builder/$storyId")({
  parseParams: ({ storyId }) => {
    return { storyId: parseInt(storyId) };
  },
  component: Page,
});
