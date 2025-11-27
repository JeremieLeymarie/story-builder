import { getBuilderService } from "@/get-builder-service";
import { useMutation } from "@tanstack/react-query";
import { useBuilderContext } from "./use-builder-context";
import { useNavigate } from "@tanstack/react-router";
import { useBuilderError } from "./use-builder-error";

export const useDeleteStory = () => {
  const { story } = useBuilderContext();
  const navigate = useNavigate();
  const { handleError } = useBuilderError();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await getBuilderService().deleteStory(story.key);
    },
    onSuccess: () => {
      navigate({ to: "/builder/stories" });
    },
    onError: (err) => {
      handleError(err.message);
    },
  });

  return { deleteStory: mutateAsync, isLoading: isPending };
};
