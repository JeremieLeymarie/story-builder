import { Button } from "../design-system/primitives";
import { DownloadIcon } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { ConfirmDialog } from "@/design-system/components";
import { apiDownloadFromStore } from "@/lib/http-client";

export const ConfirmDownloadDialog = ({ storyKey }: { storyKey: string }) => {
  const { toast } = useToast();

  const download = useCallback(
    async (storyKey: string) => {
      const res = await apiDownloadFromStore({ path: { key: storyKey } });
      if (res.error) {
        toast({
          title: "Download failed!",
          description: "Something went wrong, please try again later.",
        });
        return;
      }
      const { scenes, ...story } = res.data;
      await getLocalRepository().createStory(story);
      if (scenes) {
        await getLocalRepository().createScenes(scenes);
      }
      toast({
        title: "Download complete!",
        description: "Your game is now available in your library.",
      });
    },
    [toast]
  );

  return (
    <ConfirmDialog
      trigger={
        <Button
          className={`absolute bottom-4 right-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
        >
          Download &nbsp; <DownloadIcon size="15px" />
        </Button>
      }
      title="Are you sure?"
      description="You are about to download a story on your device."
      confirmLabel="Download"
      onConfirm={() => download(storyKey)}
    />
  );
};
