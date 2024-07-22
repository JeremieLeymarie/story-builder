import { Button } from "../design-system/primitives";
import { DownloadIcon } from "lucide-react";
import { useCallback } from "react";
import { API_URL } from "@/constants";
import { useToast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { ConfirmDialog } from "@/design-system/components";

export const ConfirmDownloadDialog = ({ storyKey }: { storyKey?: string }) => {
  const { toast } = useToast();

  const download = useCallback(
    async (storyKey?: string) => {
      try {
        const res = await fetch(`${API_URL}/api/store/download/${storyKey}`, {
          method: "GET",
        });
        const story = await res.json();
        await getLocalRepository().createStory(story);
        if (story.scenes) {
          await getLocalRepository().createScenes(story.scenes);
        }
        toast({
          title: "Download complete!",
          description: "Your game is now available in your library.",
        });
      } catch (error) {
        toast({
          title: "Download failed!",
          description: "Something went wrong, please try again later.",
        });
      }
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
