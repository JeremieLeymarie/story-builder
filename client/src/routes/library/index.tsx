import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { getLibraryService } from "@/domains/game/library-service";
import { Library } from "@/library/library";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const { games } = useLiveQuery(getLibraryService().getLibrary) ?? {};

  if (games === undefined) {
    return <BackdropLoader />;
  }

  return games ? (
    <Library stories={games} />
  ) : (
    <ErrorMessage>
      Could not get your games. Please try again later
    </ErrorMessage>
  );
};

export const Route = createFileRoute("/library/")({
  component: Component,
});
