import { getWikiService } from "@/domains/wiki/wiki-service";
import { useQuery } from "@tanstack/react-query";

const WIKI_DATA_QUERY_KEY = ["wiki-data"] as const;

export const useWikiData = ({ wikiKey }: { wikiKey: string }) => {
  const svc = getWikiService();

  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => svc.getWikiData(wikiKey),
    queryKey: [...WIKI_DATA_QUERY_KEY, wikiKey],
  });

  return { wikiData: data, isLoading, refetch };
};
