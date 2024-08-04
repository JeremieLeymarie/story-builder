import { Scene, Story } from "@/lib/storage/domain";
import { getBuilderService } from "@/services/builder";
import { useEffect } from "react";

export const useSyncBuilder = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  useEffect(() => {
    getBuilderService().syncBuilder(story, scenes);
  }, [story, scenes]);
};
