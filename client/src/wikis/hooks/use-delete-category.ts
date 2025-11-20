import { getWikiService } from "@/domains/wiki/wiki-service";
import { useWikiStore } from "./use-wiki-store";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const svc = getWikiService();
  const { wikiKey, refresh } = useWikiStore((state) => ({
    wikiKey: state.wikiData.wiki.key,
    refresh: state.refresh,
  }));

  const deleteCategory = async (categoryKey: string) => {
    try {
      await svc.deleteCategory(wikiKey, categoryKey);
      toast.success("Category deleted successfully.");
    } catch (error) {
      toast.error("Could not delete the category.");
      console.error(error);
    } finally {
      refresh();
    }
  };

  return { deleteCategory };
};
