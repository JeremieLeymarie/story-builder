import { BuilderStories } from "@/builder/components/builder-stories";
import { BackdropLoader } from "@/design-system/components";
import { ErrorMessage } from "@/design-system/components/error-message";
import { getBuilderService } from "@/get-builder-service";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const stories = useLiveQuery(getBuilderService().getUserBuilderStories);

  if (stories === undefined) return <BackdropLoader />;

  return stories ? (
    <BuilderStories stories={stories} />
  ) : (
    <ErrorMessage>Could not get stories</ErrorMessage>
  );
};

export const Route = createFileRoute("/builder/stories")({
  component: () => <Component />,
});
