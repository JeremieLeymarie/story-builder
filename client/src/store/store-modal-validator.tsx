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
        let res = await fetch(`${API_URL}/api/store/download/${mongoId}`, {
          method: "GET",
        });
        let storie = await res.json();
        await getRepository().createStory(storie);
        if (storie.scenes) {
          await getRepository().createScenes(storie.scenes);
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
                You are about to download a story on your device.
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
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
