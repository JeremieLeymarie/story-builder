import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { Library } from "@/library/library";
import { getLibraryService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const { storiesFromStore, userStories, finishedGameKeys } =
    useLiveQuery(getLibraryService().getLibrary) ?? {};

  if (
    storiesFromStore === undefined ||
    userStories === undefined ||
    finishedGameKeys === undefined
  ) {
    return <BackdropLoader />;
  }

  return storiesFromStore && userStories ? (
    <Library
      storiesFromStore={storiesFromStore}
      userStories={userStories}
      finishedGameKeys={finishedGameKeys}
    />
  ) : (
    <ErrorMessage text="Could not get your games. Please try again later" />
  );
};

export const Route = createFileRoute("/library/")({
  component: Component,
});
