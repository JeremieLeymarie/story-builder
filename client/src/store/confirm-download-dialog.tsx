import { Button } from "../design-system/primitives";
import { DownloadIcon } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { ConfirmDialog } from "@/design-system/components";
import { client } from "@/lib/http-client/client";

export const ConfirmDownloadDialog = ({ storyKey }: { storyKey: string }) => {
  const { toast } = useToast();

  const download = useCallback(
    async (storyKey: string) => {
      const { data, error } = await client.GET("/api/store/download/{key}", {
        params: { path: { key: storyKey } },
      });
      if (error) {
        toast({
          title: "Download failed!",
          description: "Something went wrong, please try again later.",
        });
        return;
      }
      const { scenes, ...story } = data;
      // TODO: move this to adapters
      await getLocalRepository().createStory({
        ...story,
        creationDate: new Date(story.creationDate),
        author: story.author ?? undefined,
        publicationDate: story.publicationDate
          ? new Date(story.publicationDate)
          : undefined,
      });
      if (scenes) {
        await getLocalRepository().createScenes(
          scenes.map((scene) => ({
            ...scene,
            actions: scene.actions.map((action) => ({
              ...action,
              sceneKey: action.sceneKey ?? undefined,
            })),
          })),
        );
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
