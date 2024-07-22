import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
} from "../../design-system/primitives";
import { DownloadIcon, CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useToast } from "@/design-system/primitives/use-toast";
import { Scene, Story } from "@/lib/storage/dexie/dexie-db";

export const ExportModal = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState<string>();
  // TODO: check that this is not impacting perfs
  const storyJson = JSON.stringify(
    {
      story,
      scenes,
    },
    null,
    2
  );

  const handleModalState = (open: boolean) => {
    if (open) {
      const blob = new Blob([storyJson], { type: "text/json" });
      const url = URL.createObjectURL(blob);
      setUrl(url);
    }
    setIsModalOpen(open);
  };

  const exportToast = useCallback(async () => {
    toast({
      title: "Export complete!",
      description: "Your game is now in your computer.",
    });
  }, [toast]);

  const copyToast = useCallback(async () => {
    toast({
      description: "Copy on clipboard !",
    });
  }, [toast]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalState}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <DownloadIcon size="16px" />
          &nbsp; Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Export your story to file
          </DialogTitle>
          <Textarea className="h-[40vh] max-h-[72.5vh] min-h-[25vh]" disabled>
            {storyJson}
          </Textarea>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              handleModalState(false);
            }}
          >
            Cancel
          </Button>
          {url && (
            <a
              href={url}
              download={story.title + ".json"}
              onClick={() => {
                exportToast();
                handleModalState(false);
              }}
            >
              <Button>
                <DownloadIcon size="16px" />
              </Button>
            </a>
          )}
          <Button
            onClick={() => {
              navigator.clipboard.writeText(storyJson);
              copyToast();
            }}
          >
            <CopyIcon size="16px" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
