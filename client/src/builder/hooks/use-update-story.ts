import { useMutation } from "@tanstack/react-query";
import { useErrorToast } from "./use-error-toast";
import { useBuilderContext } from "./use-builder-context";
import { toast } from "sonner";
import { EditStorySchema } from "./use-edit-story-form";

type MutationParams = {
  key: string;
  payload: EditStorySchema;
};

export const useUpdateStory = () => {
  const { handleError } = useErrorToast();
  const { setStory, builderService } = useBuilderContext();

  const { mutateAsync: updateStory, isPending } = useMutation({
    mutationFn: async ({ key, payload }: MutationParams) => {
      const updated = await builderService.updateStory(key, payload);
      return updated;
    },
    onError: handleError,
    onSuccess: async (story) => {
      setStory(story);
    },
  });

  return { updateStory, isPending };
};
