import { getWikiService } from "@/domains/wiki/wiki-service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllWikis = () => {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["all-wikis"],
    queryFn: getWikiService().getAllWikis,
  });

  return {
    wikis: data,
    isLoading: isPending || isFetching,
  };
};
