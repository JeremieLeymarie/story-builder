import { getBuilderService } from "@/get-builder-service";
import { useMutation } from "@tanstack/react-query";
import { StorySchema } from "../components/story-schema";
import { useBuilderError } from "./use-builder-error";
import { useBuilderContext } from "./use-builder-context";
import { toast } from "sonner";

type MutationParams = {
  key: string;
  payload: StorySchema;
};

export const useUpdateStory = () => {
  const { handleError } = useBuilderError();
  const { setStory } = useBuilderContext();
  const svc = getBuilderService();

  const { mutateAsync: updateStory, isPending } = useMutation({
    mutationFn: async ({ key, payload }: MutationParams) => {
      const updated = await svc.updateStory(key, payload);
      return updated;
    },
    onError: handleError,
    onSuccess: async (story) => {
      toast.success("Story successfully updated!");
      setStory(story);
    },
  });

  return { updateStory, isPending };
};
