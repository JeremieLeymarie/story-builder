import { getWikiService } from "@/domains/wiki/wiki-service";
import { ArticleSchema } from "../schema";
import { useWikiStore } from "./use-wiki-store";
import { toast } from "sonner";

export const useArticleActions = () => {
  const svc = getWikiService();
  const { refresh, wikiKey } = useWikiStore((state) => ({
    refresh: state.refresh,
    wikiKey: state.wikiData.wiki.key,
  }));

  const createArticle = async (payload: ArticleSchema) => {
    try {
      await svc.createArticle(wikiKey, payload);
      await refresh();
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  // const updateArticle = async (payload: Partial<ArticleSchema>) => {};

  return { createArticle };
};
