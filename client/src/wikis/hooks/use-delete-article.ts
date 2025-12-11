import { getWikiService } from "@/domains/wiki/wiki-service";
import { useWikiStore } from "./use-wiki-store";
import { toast } from "sonner";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback } from "react";

export const useDeleteArticle = () => {
  const svc = getWikiService();
  const { wikiKey, refresh } = useWikiStore((state) => ({
    wikiKey: state.wikiData.wiki.key,
    refresh: state.refresh,
  }));
  const navigate = useNavigate();
  const { articleKey: currentArticleKey } = useParams({ strict: false });

  const deleteArticle = async (articleKey: string) => {
    try {
      await svc.removeArticle(articleKey);
      toast.success("Article deleted successfully.");

      if (currentArticleKey === articleKey) {
        navigate({ to: "/wikis/$wikiKey", params: { wikiKey } });
      }
    } catch (error) {
      toast.error("Could not delete the article.");
      console.error(error);
    } finally {
      refresh();
    }
  };

  const getArticleLinkCount = useCallback(
    async (articleKey: string): Promise<number> => {
      return await svc.getArticleLinkCountByArticle(articleKey);
    },
    [svc],
  );

  return { deleteArticle, getArticleLinkCount };
};
