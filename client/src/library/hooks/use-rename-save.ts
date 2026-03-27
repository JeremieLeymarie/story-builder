import { getLibraryService } from "@/domains/game/library-service";
import { StoryProgress } from "@/lib/storage/domain";
import { useMutation } from "@tanstack/react-query";

export const useRenameSave = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const { mutateAsync } = useMutation({
    mutationFn: async ({ progress, name }: { progress: StoryProgress; name: string }) => {
      return getLibraryService().renameStoryProgress(progress, name);
    },
    onSuccess() {
      onSuccess?.();
    },
  });

  return { renameSave: mutateAsync };
};
