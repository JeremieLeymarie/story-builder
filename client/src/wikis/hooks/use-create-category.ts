import { getWikiService } from "@/domains/wiki/wiki-service";
import { useWikiStore } from "./use-wiki-store";
import { CategorySchema } from "../schemas";
import { toast } from "sonner";

export const useCreateCategory = () => {
  const svc = getWikiService();
  const { wikiKey, refresh } = useWikiStore((state) => ({
    wikiKey: state.wikiData.wiki.key,
    refresh: state.refresh,
  }));

  const createCategory = async (payload: CategorySchema) => {
    try {
      await svc.createCategory(wikiKey, payload);
    } catch (error) {
      toast.error("Could not create a category.");
      console.error(error);
    } finally {
      refresh();
    }
  };

  return { createCategory };
};
