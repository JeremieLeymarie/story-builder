import { toast } from "@/design-system/primitives/use-toast";
import { useCallback, useState } from "react";
import { OnSubmitStoryFormProps } from "../components/story-form/story-form-dialog";
import { Story, Scene } from "@/lib/storage/domain";
import { getBuilderService } from "@/services/builder";
import { getUserService } from "@/services";

export const usePublishStory = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  const builderService = getBuilderService();
  const userService = getUserService();
  const [modal, setModal] = useState<"auth" | "edit-story" | "confirm" | null>(
    null,
  );

  const updateLocalStory = useCallback(
    async (data: OnSubmitStoryFormProps) => {
      await builderService.updateStory({
        ...story,
        ...data,
      });
      setModal("confirm");
    },
    [builderService, story],
  );

  const publish = useCallback(async () => {
    const success = await builderService.publishStory(scenes, story);

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
  }, [builderService, scenes, story]);

  const handlePublishClick = useCallback(async () => {
    const user = await userService.getCurrentUser();

    if (!user) {
      // Prompt user for sign-in/sign-up
      setModal("auth");
      return;
    }

    setModal("edit-story");
  }, [userService]);

  return {
    publish,
    handlePublishClick,
    updateLocalStory,
    modal,
    setModal,
  };
};
