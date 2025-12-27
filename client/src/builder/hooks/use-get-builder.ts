import { getBuilderService } from "@/get-builder-service";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const makeGetBuilderQueryOptions = ({
  storyKey,
}: {
  storyKey: string;
}) => {
  return queryOptions({ queryKey: ["builder-story-data", storyKey] });
};

export const useGetBuilder = ({ storyKey }: { storyKey: string }) => {
  const options = makeGetBuilderQueryOptions({ storyKey });

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => getBuilderService().getBuilderStoryData(storyKey),
    queryKey: options.queryKey,
    refetchOnWindowFocus: false,
  });

  return { story: data?.story, scenes: data?.scenes, isLoading, refetch };
};
