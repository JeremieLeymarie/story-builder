import { getLibraryService } from "@/domains/game/library-service";
import { getLocalRepository, getRemoteAPIRepository } from "@/repositories";
import { useState } from "react";

export const useDeleteProgress = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProgress = async (progressKey: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      const libraryService = getLibraryService();
      const localRepository = getLocalRepository();
      const remoteRepository = getRemoteAPIRepository();

      // Delete locally
      await libraryService.deleteStoryProgress(progressKey);

      // Try to delete remotely if user is online and authenticated
      try {
        const user = await localRepository.getUser();
        if (user && user.token) {
          const result = await remoteRepository.deleteStoryProgress(progressKey, user);
          if (!result.data?.success) {
            console.warn("Failed to delete progress remotely:", result.error);
          }
        }
      } catch (remoteError) {
        console.warn("Failed to delete progress remotely:", remoteError);
        // Don't throw here - local deletion succeeded
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProgress,
    isDeleting,
    error,
  };
};