import { getLibraryService } from "@/domains/game/library-service";
import { useMutation } from "@tanstack/react-query";

export const useDeleteGame = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (gameKey: string) => {
      getLibraryService().deleteGame(gameKey);
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  return {
    deleteGame: mutateAsync,
    isPending,
  };
};
