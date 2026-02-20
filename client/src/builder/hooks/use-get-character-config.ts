import { queryOptions, useQuery } from "@tanstack/react-query";
import { useBuilderContext } from "./use-builder-context";

const useGetCharacterConfigQueryOptions = () => {
  const { builderService, story } = useBuilderContext();

  return queryOptions({
    queryKey: ["character-config", story.key],
    queryFn: async () => {
      return builderService.getCharacterConfig(story.key);
    },
  });
};

export const useGetCharacterConfig = () => {
  const opts = useGetCharacterConfigQueryOptions();

  const { data, isLoading } = useQuery(opts);

  return { characterConfig: data, isLoading };
};
