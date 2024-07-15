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
  const storyJson = JSON.stringify(
    {
      story,
      scenes,
    },
    null,
    2
  );

  const blob = new Blob([storyJson], { type: "text/json" });
  const url = URL.createObjectURL(blob);

  const exportToast = useCallback(async () => {
    try {
      toast({
        title: "Export complete!",
        description: "Your game is now in your computer.",
      });
    } catch (error) {
      toast({
        title: "Export failed!",
        description: "Something went wrong, please try again later.",
      });
    }
  }, [toast]);

  const copyToast = useCallback(async () => {
    try {
      toast({
        description: "Copy on clipboard !",
      });
    } catch (error) {
      toast({
        title: "Export failed!",
        description: "Something went wrong, please try again later.",
      });
    }
  }, [toast]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
              setIsModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <a
            href={url}
            download={story.title + ".json"}
            onClick={() => {
              exportToast();
              setIsModalOpen(false);
            }}
          >
            <Button>
              <DownloadIcon size="16px" />
            </Button>
          </a>
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
