import { useMutation } from "@tanstack/react-query";
import { getLibraryService } from "@/domains/game/library-service";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export const useDeleteProgress = (storyKey: string) => {
  const { navigate } = useRouter();

    const {
    mutateAsync: deleteProgress,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: async (progressKey: string) => {
      const libraryService = getLibraryService();

      // Check if this is the last progress for the story
      const { otherProgresses, currentProgress } =
        await libraryService.getGameDetail(storyKey);
      const totalProgresses = [currentProgress, ...otherProgresses];

      await libraryService.deleteStoryProgress(progressKey);

      return { redirectToLibrary: totalProgresses.length === 1 };
    },
    onError: () => {
      toast.error("Could not delete progress");
    },

    onSuccess: ({ redirectToLibrary }) => {
      if (redirectToLibrary) navigate({ to: "/library" });
      toast.success("Save deleted successfully");
    },
  });


  return {
    deleteProgress,
    isDeleting,
    isError,
  };
};
