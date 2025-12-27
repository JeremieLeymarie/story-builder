import { queryOptions, useQuery } from "@tanstack/react-query";
import { useBuilderContext } from "./use-builder-context";

export const makeGetBuilderQueryOptions = ({
  storyKey,
}: {
  storyKey: string;
}) => {
  return queryOptions({ queryKey: ["builder-story-data", storyKey] });
};

export const useGetBuilder = ({ storyKey }: { storyKey: string }) => {
  const { builderService } = useBuilderContext();
  const options = makeGetBuilderQueryOptions({ storyKey });

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => builderService.getBuilderStoryData(storyKey),
    queryKey: options.queryKey,
    refetchOnWindowFocus: false,
  });

  return { story: data?.story, scenes: data?.scenes, isLoading, refetch };
};
