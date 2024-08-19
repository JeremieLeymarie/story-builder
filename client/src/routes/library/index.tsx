import { ErrorMessage, Loader } from "@/design-system/components";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { Library } from "@/library/library";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

const Component = () => {
  const repo = getLocalRepository();
  const data = useLiveQuery(async () =>
    Promise.all([
      repo.getUser(),
      repo.getStories(),
      repo.getFinishedGameKeys(),
    ]),
  );

  const [user, stories, finishedGames] = data ?? [];

  const userStories =
    stories?.filter((story) => story.author?.key === user?.key) ?? [];
  const storiesFromStore =
    stories?.filter((story) => story.author?.key !== user?.key) ?? [];

  if (!data) return <Loader />;

  return stories ? (
    <Library
      storiesFromStore={storiesFromStore}
      userStories={userStories}
      finishedGameKeys={finishedGames ?? []}
    />
  ) : (
    <ErrorMessage text="Could not get your games. Please try again later" />
  );
};

export const Route = createFileRoute("/library/")({
  component: Component,
});
