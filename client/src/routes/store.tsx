import { Store } from "@/store/store";
import { Offline } from "@/offline";
import { ErrorMessage } from "@/design-system/components/error-message";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useIsOnline } from "@/hooks/use-is-online";
import { BackdropLoader } from "@/design-system/components";
import { Story, StoryGenre } from "@/lib/storage/domain";
import { getStoreService } from "@/services/store-service";

const StoreComponent = () => {
  const [stories, setStories] = useState<{
    storiesByGenre: Record<StoryGenre, Story[]>;
  } | null>();

  useEffect(() => {
    getStoreService().getItems().then(setStories);
  }, []);

  if (stories === undefined) return <BackdropLoader />;

  return stories ? (
    <Store storiesByGenre={stories.storiesByGenre} />
  ) : (
    <ErrorMessage text="Could not get stories" />
  );
};

const OfflineComponent = () => {
  return <Offline />;
};

const Component = () => {
  const isOnline = useIsOnline();
  if (isOnline) {
    return <StoreComponent />;
  } else {
    return <OfflineComponent />;
  }
};

export const Route = createFileRoute("/store")({
  component: Component,
});
