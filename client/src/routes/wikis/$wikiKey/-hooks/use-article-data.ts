import { getWikiService } from "@/domains/wiki/wiki-service";
import { useQuery } from "@tanstack/react-query";

const ARTICLE_QUERY_KEY = ["wiki-article"] as const;

export const useArticleData = ({ articleKey }: { articleKey: string }) => {
  const svc = getWikiService();
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => svc.getArticle(articleKey),
    queryKey: [...ARTICLE_QUERY_KEY, articleKey],
  });

  return { articleData: data, isLoading, refetch };
};
