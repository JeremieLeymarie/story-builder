import { API_URL } from "@/constants";
import { toast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useCallback } from "react";

export const usePublish = () => {
  const publish = useCallback(async () => {
    const repo = getLocalRepository();

    fetch(`${API_URL}/api/builder/save/game`, {
      body: JSON.stringify({}),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        toast({
          title: "Synchronization complete!",
          description: "Your progress has successfully been saved.",
        });
      })
      .catch(() => {
        toast({
          title: "Synchronization failed!",
          description: "Something went wrong, please try again later.",
        });
      });
  }, []);
};
