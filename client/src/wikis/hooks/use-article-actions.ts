import { getWikiService } from "@/domains/wiki/wiki-service";
import { useWikiStore } from "./use-wiki-store";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { ArticleSchema } from "../schemas";

export const useArticleActions = () => {
  const svc = getWikiService();
  const { refresh, wikiKey } = useWikiStore((state) => ({
    refresh: state.refresh,
    wikiKey: state.wikiData.wiki.key,
  }));
  const navigate = useNavigate();

  const createArticle = async (payload: ArticleSchema) => {
    try {
      const articleKey = await svc.createArticle(wikiKey, payload);
      await refresh();
      navigate({
        to: "/wikis/$wikiKey/$articleKey",
        params: { wikiKey, articleKey },
      });
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const updateArticle = async (
    articleKey: string,
    payload: Partial<ArticleSchema>,
  ) => {
    try {
      await svc.updateArticle(articleKey, {
        ...payload,
        categoryKey: payload.categoryKey ?? undefined,
      });
      await refresh();
      navigate({
        to: "/wikis/$wikiKey/$articleKey",
        params: { wikiKey, articleKey },
      });
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return { createArticle, updateArticle };
};
