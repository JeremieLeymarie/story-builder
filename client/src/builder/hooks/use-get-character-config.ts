import { queryOptions, useQuery } from "@tanstack/react-query";
import { useBuilderContext } from "./use-builder-context";

export const useGetCharacterConfigQueryOptions = () => {
  const { characterService, story } = useBuilderContext();

  return queryOptions({
    queryKey: ["character-config", story.key],
    queryFn: async () => {
      return await characterService.getCharacter(story.key);
    },
  });
};

export const useGetCharacterConfig = () => {
  const opts = useGetCharacterConfigQueryOptions();

  const { data, isLoading } = useQuery(opts);

  return { characterConfig: data, isLoading };
};
