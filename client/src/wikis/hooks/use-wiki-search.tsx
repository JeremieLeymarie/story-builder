import { getWikiService } from "@/domains/wiki/wiki-service";
import { useQuery } from "@tanstack/react-query";
import { useWikiStore } from "./use-wiki-store";

export const useWikiSearch = (searchValue: string) => {
  const wikiKey = useWikiStore((state) => state.wikiData.wiki.key);

  const { data, isLoading } = useQuery({
    queryKey: ["wiki-search", searchValue],
    queryFn: async () => {
      return getWikiService().search(wikiKey, searchValue);
    },
  });

  return { searchResults: data, isLoading };
};
