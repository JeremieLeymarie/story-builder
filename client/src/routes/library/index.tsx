import { ErrorMessage } from "@/design-system/components";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { Library } from "@/library/library";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const stories = useLiveQuery(() => getLocalRepository().getGames());
  return stories ? (
    <Library stories={stories} />
  ) : (
    <ErrorMessage text="Could not get your games. Please try again later" />
  );
};

export const Route = createFileRoute("/library/")({
  component: Component,
});
