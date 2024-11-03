import { Loader, ErrorMessage } from "@/design-system/components";
import { Library } from "@/library/library";
import { getLibraryService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const { games } = useLiveQuery(getLibraryService().getLibrary) ?? {};

  if (games === undefined) {
    return <Loader />;
  }

  return games ? (
    <Library stories={games} />
  ) : (
    <ErrorMessage text="Could not get your games. Please try again later" />
  );
};

export const Route = createFileRoute("/library/")({
  component: Component,
});
