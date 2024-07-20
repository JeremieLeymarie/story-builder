import { BuilderStories } from "@/builder/components/builder-stories";
import { Loader } from "@/design-system/components";
import { ErrorMessage } from "@/design-system/components/error-message";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const stories = useLiveQuery(() => getLocalRepository().getStories());

  if (stories === undefined) return <Loader />;

  return stories ? (
    <BuilderStories stories={stories} />
  ) : (
    <ErrorMessage text="Could not get stories" />
  );
};

export const Route = createFileRoute("/builder/stories")({
  component: () => <Component />,
});
