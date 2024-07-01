import { BuilderStories } from "@/builder/components/builder-stories";
import { ErrorMessage } from "@/design-system/components/error-message";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const stories = useLiveQuery(() => getRepository().getStories());

  return stories ? (
    <BuilderStories stories={stories} />
  ) : (
    <ErrorMessage text="Could not get stories" />
  );
};

export const Route = createFileRoute("/builder/stories")({
  component: () => <Component />,
});
