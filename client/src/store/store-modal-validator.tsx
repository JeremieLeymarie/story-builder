import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../design-system/primitives";
import { AlertTriangleIcon, DownloadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { API_URL } from "@/constants";
import { useToast } from "@/design-system/primitives/use-toast";
import { getRepository } from "@/lib/storage/dexie/indexed-db-repository";

export const ModalValidator = ({ mongoId }: { mongoId?: string }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const download = useCallback(
    async (mongoId: string | undefined) => {
      try {
        let download: any = await fetch(
          `${API_URL}/api/store/download/${mongoId}`,
          {
            method: "GET",
          }
        );
        download = await download.json();
        await getRepository().createStory(download);
        if (download.scenes) {
          await getRepository().createScenes(download.scenes);
        }
        toast({
          title: "download complete!",
          description: "You can play.",
        });
      } catch (error) {
        toast({
          title: "download failed!",
          description: "Something went wrong, please try again later.",
        });
      }
    },
    [toast]
  );

  return (
    <div>
      <div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger>
            <Button
              className={`absolute opacity-0 transition ease-in-out duration-300 group-hover:opacity-100 bottom-4 right-4`}
            >
              Download &nbsp; <DownloadIcon size="15px" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangleIcon size="20px" />
                Are you sure?
              </DialogTitle>
              <DialogDescription>
                you want to download this story
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  download(mongoId);
                  setIsModalOpen(false);
                }}
              >
                download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
