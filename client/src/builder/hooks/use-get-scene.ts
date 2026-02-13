import { queryOptions, useQuery } from "@tanstack/react-query";
import { useBuilderContext } from "./use-builder-context";

export const makeGetSceneQueryOptions = (sceneKey: string) => {
  return queryOptions({ queryKey: ["scene", sceneKey] });
};

export const useGetScene = (sceneKey: string) => {
  const { builderService } = useBuilderContext();
  const { data, isLoading } = useQuery({
    queryKey: makeGetSceneQueryOptions(sceneKey).queryKey,
    queryFn: async () => {
      const scenesByKey = await builderService.getScenesByKey([sceneKey]);
      if (!scenesByKey[sceneKey]) {
        throw new Error(`Scene not found ${sceneKey}`);
      }
      return scenesByKey[sceneKey]!;
    },
  });

  return { scene: data, isLoading };
};
