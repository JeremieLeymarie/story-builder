import { getBuilderService } from "@/get-builder-service";
import { useQuery } from "@tanstack/react-query";

export const useGetBuilder = ({ storyKey }: { storyKey: string }) => {
  const { data, isLoading, refetch } = useQuery({
    queryFn: () => getBuilderService().getBuilderStoryData(storyKey),
    queryKey: ["builder-story-data", storyKey],
    refetchOnWindowFocus: false,
  });

  return { story: data?.story, scenes: data?.scenes, isLoading, refetch };
};
