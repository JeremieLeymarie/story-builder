import { API_URL } from "@/constants";
import { useToast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useCallback, useState } from "react";

export const useSynchronizeBuilder = ({ storyKey }: { storyKey: string }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();

  const synchronize = useCallback(async () => {
    const repo = getLocalRepository();

    const user = await repo.getUser();

    if (!user) {
      // Prompt user for sign-in/sign-up
      setIsAuthModalOpen(true);
      return;
    }

    const story = await repo.getStory(storyKey);
    const scenes = await repo.getScenes(storyKey);

    fetch(`${API_URL}/api/builder/save/game`, {
      body: JSON.stringify({ story, scenes }),
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
  }, [storyKey, toast]);

  return { synchronize, isAuthModalOpen, setIsAuthModalOpen };
};
