import { Button } from "../design-system/primitives";
import { DownloadIcon } from "lucide-react";
import { useCallback } from "react";
import { API_URL } from "@/constants";
import { useToast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { ConfirmDialog } from "@/design-system/components";

export const ModalValidator = ({ remoteId }: { remoteId?: string }) => {
  const { toast } = useToast();
  const download = useCallback(
    async (remoteId: string | undefined) => {
      try {
        const res = await fetch(`${API_URL}/api/store/download/${remoteId}`, {
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
          className={`absolute opacity-0 transition ease-in-out duration-300 group-hover:opacity-100 bottom-4 right-4`}
        >
          Download &nbsp; <DownloadIcon size="15px" />
        </Button>
      }
      title="Are you sure?"
      description="You are about to download a story on your device."
      confirmLabel="Download"
      onConfirm={() => download(remoteId)}
    />
  );
};
