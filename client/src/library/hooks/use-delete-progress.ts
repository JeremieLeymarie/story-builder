import { useMutation } from "@tanstack/react-query";
import { getLibraryService } from "@/domains/game/library-service";
import { toast } from "sonner";

export const useDeleteProgress = () => {
  const {
    mutateAsync: deleteProgress,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: async (progressKey: string) => {
      const libraryService = getLibraryService();
      await libraryService.deleteStoryProgress(progressKey);
    },
    onError: () => {
      toast.error("Could not delete progress");
    },
  });

  return {
    deleteProgress,
    isDeleting,
    isError,
  };
};
