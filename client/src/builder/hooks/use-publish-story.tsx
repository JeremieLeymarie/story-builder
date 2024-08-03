import { toast } from "@/design-system/primitives/use-toast";
import { useCallback, useState } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form/story-form-dialog";
import { Story, Scene } from "@/lib/storage/domain";
import { getLocalRepository } from "@/repositories/indexed-db-repository";
import { getBuilderService } from "@/services/builder-service";

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
    const success = await getBuilderService().publishStory(scenes, story);

    if (success) {
      toast({
        title: "Congratulations!",
        description: "Your story is now available in the store!",
      });
      // TODO: navigate to individual store page
    } else {
      toast({
        title: "Publication failed!",
        description: "Something went wrong, please try again later.",
      });
    }
  }, [scenes, story]);

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
