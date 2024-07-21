import { Store } from "@/store/store";
import { Offline } from "@/offline";
import { ErrorMessage } from "@/design-system/components/error-message";
import { createFileRoute } from "@tanstack/react-router";
import { Story } from "@/lib/storage/dexie/dexie-db";
import { useEffect, useState } from "react";
import { useIsOnline } from "@/hooks/use-is-online";
import { apiGetStoreItems } from "@/lib/http-client";
import { Loader } from "@/design-system/components";

const StoreComponent = () => {
  const [stories, setStories] = useState<Story[] | null>();

  useEffect(() => {
    apiGetStoreItems().then((response) => setStories(response.data ?? null));
  }, []);

  if (stories === undefined) return <Loader />;

  return stories ? (
    <Store stories={stories} />
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
