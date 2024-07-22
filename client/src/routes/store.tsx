import { Store } from "@/store/store";
import { Offline } from "@/offline";
import { ErrorMessage } from "@/design-system/components/error-message";
import { createFileRoute } from "@tanstack/react-router";
import { Story } from "@/lib/storage/dexie/dexie-db";
import { useEffect, useState } from "react";
import { useIsOnline } from "@/hooks/use-is-online";
import { Loader } from "@/design-system/components";
import { client } from "@/lib/http-client/client";
import { adapter } from "@/lib/http-client/adapters";

const StoreComponent = () => {
  const [stories, setStories] = useState<Story[] | null>();

  useEffect(() => {
    client.GET("/api/store/load").then((res) => {
      setStories(res.data ? adapter.fromAPI.stories(res.data) : null);
    });
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
