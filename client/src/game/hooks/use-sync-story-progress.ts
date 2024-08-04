import { StoryProgress } from "@/lib/storage/domain";
import { getGameService } from "@/services";
import { useEffect } from "react";

export const useSyncStoryProgress = ({
  progress,
}: {
  progress: StoryProgress;
}) => {
  useEffect(() => {
    getGameService().syncStoryProgress(progress);
  }, [progress]);
};
