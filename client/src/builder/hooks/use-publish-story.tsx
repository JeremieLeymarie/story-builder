import { API_URL } from "@/constants";
import { toast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useCallback, useState } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form-dialog";
import { Scene, Story } from "@/lib/storage/dexie/dexie-db";

export const usePublishStory = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  const repo = getLocalRepository();
  const [modal, setModal] = useState<"auth" | "edit-story" | "confirm" | null>(
    null,
  );

  const updateLocalStory = useCallback(
    async (data: OnSubmitStoryFormProps) => {
      await repo.updateStory({
        ...data,
        status: story.status,
        id: story.id,
      });
      setModal("confirm");
    },
    [repo, story.id, story.status],
  );

  const publish = useCallback(async () => {
    fetch(`${API_URL}/api/store/publish`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story, scenes }),
    })
      .then(async () => {
        await repo.updateStory({ ...story, status: "published" });
        // TODO: navigate to individual store page
      })
      .catch(() => {
        toast({
          title: "Publication failed!",
          description: "Something went wrong, please try again later.",
        });
      });
  }, [repo, scenes, story]);

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
    updateLocalStory,
    modal,
    setModal,
  };
};
