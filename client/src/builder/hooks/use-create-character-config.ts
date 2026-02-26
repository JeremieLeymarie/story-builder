import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBuilderContext } from "./use-builder-context";
import { useErrorToast } from "./use-error-toast";
import { useGetCharacterConfigQueryOptions } from "./use-get-character-config";

export const useCreateCharacterConfig = () => {
  const { characterService, story } = useBuilderContext();
  const { handleError } = useErrorToast();
  const queryClient = useQueryClient();
  const characterQueryOptions = useGetCharacterConfigQueryOptions();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => characterService.createCharacter(story.key),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: characterQueryOptions.queryKey,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return { createCharacterConfig: mutateAsync, isPending };
};
