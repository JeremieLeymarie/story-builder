import { getLibraryService } from "@/domains/game/library-service";
import { StoryProgress } from "@/lib/storage/domain";
import { useMutation } from "@tanstack/react-query";

export const useCreateSave = ({
  onSuccess,
}: {
  onSuccess: (save: StoryProgress) => void;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      storyKey,
      name,
    }: {
      storyKey: string;
      name?: string;
    }) => {
      const save = await getLibraryService().createBlankStoryProgress({
        storyKey,
        name,
      });
      return save;
    },
    onSuccess(data) {
      onSuccess(data);
    },
  });

  return { createSave: mutateAsync, isPending };
};
