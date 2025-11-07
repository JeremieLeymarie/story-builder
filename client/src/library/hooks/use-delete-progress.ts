import { useMutation } from "@tanstack/react-query";
import { getLocalRepository } from "@/repositories";

export const useDeleteProgress = () => {
  const {
    mutateAsync: deleteProgress,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: async (progressKey: string) => {
      const localRepository = getLocalRepository();
      await localRepository.deleteStoryProgresses([progressKey]);
    },
    onError: () => {
      // TODO: handle error, show toast...
    },
  });

  return {
    deleteProgress,
    isDeleting,
    isError,
  };
};
