import { toast } from "@/design-system/primitives/use-toast";
import { useCallback, useState } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form/story-form-dialog";
import { client } from "@/lib/http-client/client";
import { adapter } from "@/lib/http-client/adapters";
import { Story, Scene } from "@/lib/storage/domain";
import { getLocalRepository } from "@/repositories/indexed-db-repository";

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
      const user = await repo.getUser();
      await repo.updateStory({
        ...story,
        ...data,
        publicationDate: new Date(),
        ...(user && { author: { key: user.key, username: user.username } }),
      });
      setModal("confirm");
    },
    [repo, story],
  );

  const publish = useCallback(async () => {
    const response = await client.PUT("/api/store/publish", {
      body: { scenes, story: adapter.fromClient.story(story) },
    });

    if (response.error) {
      toast({
        title: "Publication failed!",
        description: "Something went wrong, please try again later.",
      });
    } else {
      await repo.updateStory({ ...story, status: "published" });
      toast({
        title: "Congratulations!",
        description: "Your story is now available in the store!",
      });
      // TODO: navigate to individual store page
    }
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
