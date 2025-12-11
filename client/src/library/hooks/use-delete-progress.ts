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
      if (storyKey) {
        const { otherProgresses, currentProgress } =
          await libraryService.getGameDetail(storyKey);
        const totalProgresses = [currentProgress, ...otherProgresses].filter(
          Boolean,
        );

        if (totalProgresses.length === 1) {
          // This is the last progress, redirect to library after deletion
          await libraryService.deleteStoryProgress(progressKey);
          navigate({ to: "/library" });
          toast.success("Last save deleted. Returning to library.");
          return;
        }
      }

      await libraryService.deleteStoryProgress(progressKey);
      toast.success("Save deleted successfully");
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
