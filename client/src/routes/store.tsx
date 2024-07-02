import { Store } from "@/store";
import { Offline } from "@/offline";
import { ErrorMessage } from "@/design-system/components/error-message";
import { createFileRoute } from "@tanstack/react-router";
import { Story } from "@/lib/storage/dexie-db";
import { useEffect, useState } from "react";
import { API_URL } from "@/constants";
import { useIsOnline } from "@/hooks/use-is-online";

const StoreComponent = () => {
  const [stories, setStories] = useState<Story[]>();

  useEffect(() => {
    async function getStories() {
      const stories = await fetch(`${API_URL}/api/store/load`, {
        method: "GET",
      });
      setStories(await stories.json());
    }
    getStories();
  }, []);

  return stories ? (
    <Store stories={stories} />
  ) : (
    <ErrorMessage text="Could not get stories" />
  );
};

const OfflineComponent = () => {
  return <Offline />;
};

export const Route = createFileRoute("/store")({
  component: () => {
    const isOnline = useIsOnline();
    if (isOnline) {
      return <StoreComponent />;
    } else {
      return <OfflineComponent />;
    }
  },
});
