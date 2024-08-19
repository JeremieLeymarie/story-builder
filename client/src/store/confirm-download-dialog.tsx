import { Button } from "../design-system/primitives";
import { DownloadIcon } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "@/design-system/primitives/use-toast";
import { ConfirmDialog } from "@/design-system/components";
import { getStoreService } from "@/services/store-service";

export const ConfirmDownloadDialog = ({ storyKey }: { storyKey: string }) => {
  const { toast } = useToast();

  const download = useCallback(
    async (storyKey: string) => {
      const success = await getStoreService().downloadStory(storyKey);

      if (success) {
        toast({
          title: "Download complete!",
          description: "Your game is now available in your library.",
        });
      } else {
        toast({
          title: "Download failed!",
          description: "Something went wrong, please try again later.",
        });
      }
    },
    [toast],
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
