import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBuilderContext } from "./use-builder-context";
import { CharacterAttribute } from "@/lib/storage/domain";
import { useGetCharacterConfigQueryOptions } from "./use-get-character-config";
import { useErrorToast } from "./use-error-toast";

export const useCharacterAttributeActions = () => {
  const { characterService, story } = useBuilderContext();
  const queryClient = useQueryClient();
  const getCharacterQueryOptions = useGetCharacterConfigQueryOptions();
  const { handleError } = useErrorToast();

  const { mutateAsync: addAttribute } = useMutation({
    mutationFn: (attribute: Omit<CharacterAttribute, "key">) =>
      characterService.addAttribute(story.key, attribute),
    onError: handleError,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: getCharacterQueryOptions.queryKey,
      }),
  });

  const { mutateAsync: updateAttribute } = useMutation({
    mutationFn: (
      attribute: Partial<Omit<CharacterAttribute, "key" | "type">> & {
        key: string;
      },
    ) => characterService.updateAttribute(story.key, attribute),
    onError: handleError,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: getCharacterQueryOptions.queryKey,
      }),
  });

  const { mutateAsync: removeAttribute } = useMutation({
    mutationFn: (attributeKey: string) =>
      characterService.removeAttribute(story.key, attributeKey),
    onError: handleError,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: getCharacterQueryOptions.queryKey,
      }),
  });

  return { addAttribute, updateAttribute, removeAttribute };
};
