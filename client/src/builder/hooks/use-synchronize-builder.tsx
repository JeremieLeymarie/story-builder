import { useToast } from "@/design-system/primitives/use-toast";
import { adapter } from "@/lib/http-client/adapters";
import { client } from "@/lib/http-client/client";
import { getLocalRepository } from "@/repositories/indexed-db-repository";
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

    if (!story) {
      throw new Error(`Could not find story from key: ${storyKey}`);
    }

    const response = await client.POST("/api/builder/save/game", {
      body: { story: adapter.fromClient.story(story), scenes },
    });
    if (response.error) {
      return toast({
        title: "Synchronization failed!",
        description: "Something went wrong, please try again later.",
      });
    }
    toast({
      title: "Synchronization complete!",
      description: "Your progress has successfully been saved.",
    });
  }, [storyKey, toast]);

  return { synchronize, isAuthModalOpen, setIsAuthModalOpen };
};
