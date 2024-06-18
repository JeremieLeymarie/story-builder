import { BuilderHome } from "@/components/builder/builder-home";
import { ErrorMessage } from "@/design-system/components/error-message";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const stories = useLiveQuery(() => getRepository().getStories());

  return stories ? (
    <BuilderHome stories={stories} />
  ) : (
    <ErrorMessage text="Could not get stories" />
  );
};

export const Route = createFileRoute("/builder/stories")({
  component: () => <Component />,
});
