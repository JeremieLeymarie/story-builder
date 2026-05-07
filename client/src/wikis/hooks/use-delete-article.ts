import { getWikiService } from "@/domains/wiki/wiki-service";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { useWikiStore } from "./use-wiki-store";

export const useDeleteArticle = () => {
  const navigate = useNavigate();
  const [wikiKey, refresh] = useWikiStore((state) => [
    state.wikiData.wiki.key,
    state.refresh,
  ]);
  const { articleKey: currentArticleKey } = useParams({ strict: false });

  const { mutateAsync } = useMutation({
    mutationFn: async (articleKey: string) => {
      const wikiService = getWikiService();
      await wikiService.removeArticle(articleKey);
    },
    onSuccess: (_, deletedArticleKey: string) => {
      toast.success("Article deleted successfully.");
      if (currentArticleKey === deletedArticleKey)
        navigate({ to: "/wikis/$wikiKey", params: { wikiKey } });
      else refresh();
    },
    onError: (error) => {
      toast.error("Could not delete the article.");
      console.error(error);
    },
  });

  return { deleteArticle: mutateAsync };
};
