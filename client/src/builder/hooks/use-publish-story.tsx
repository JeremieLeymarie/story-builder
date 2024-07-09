import { API_URL } from "@/constants";
import { toast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useCallback, useState } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form-dialog";
import { StoryStatus } from "@/lib/storage/dexie/dexie-db";

// TODO: We could open an modal containing the story's data, to make sure everything is ok before actually publishing the story
// Alternatively, a simple confirmation modal would be good

export const usePublishStory = ({
  storyId,
  remoteStoryId,
  storyStatus,
}: {
  storyId: number;
  storyStatus: StoryStatus;
  remoteStoryId?: string;
}) => {
  const repo = getLocalRepository();
  const [modal, setModal] = useState<"auth" | "edit-story" | null>(null);

  const publish = useCallback(
    async (data: OnSubmitStoryFormProps) => {
      const story = await repo.updateStory({
        ...data,
        status: storyStatus,
        id: storyId,
      });

      fetch(`${API_URL}/api/store/publish/${remoteStoryId}`, { method: "PUT" })
        .then(() => {
          // TODO: toasts & update dexie
          toast({
            title: "Your story!",
            description: "Your progress has successfully been saved.",
          });
        })
        .catch(() => {
          toast({
            title: "Synchronization failed!",
            description: "Something went wrong, please try again later.",
          });
        });
    },
    [remoteStoryId, repo, storyId, storyStatus]
  );

  const handlePublishClick = useCallback(async () => {
    const user = await repo.getUser();

    if (!user) {
      // Prompt user for sign-in/sign-up
      setModal("auth");
      return;
    }

    setModal("edit-story");
  }, [repo]);

  return {
    publish,
    handlePublishClick,
    modal,
    setModal,
  };
};
