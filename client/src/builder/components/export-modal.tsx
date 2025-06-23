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
import { useState } from "react";
import { Scene, Story } from "@/lib/storage/domain";
import { ButtonShortCutDoc } from "@/design-system/components/shortcut-doc";

import { toast } from "sonner";
import { useExportModalStore } from "../hooks/use-export-modal-store";

export const ExportModal = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  const { isOpen, setOpen } = useExportModalStore();
  const [url, setUrl] = useState<string>();
  // TODO: check that this is not impacting perfs
  const storyJson = JSON.stringify(
    {
      story,
      scenes,
    },
    null,
    2,
  );

  const handleModalState = (open: boolean) => {
    if (open) {
      const blob = new Blob([storyJson], { type: "text/json" });
      const url = URL.createObjectURL(blob);
      setUrl(url);
    }

    setOpen(open);
  };

  const exportToast = async () => {
    toast.success("Export complete!", {
      description: "Your game is now in your computer.",
    });
  };

  const copyToast = async () => {
    toast.success("Copied to clipboard !");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalState}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start" size="sm">
          <DownloadIcon size="16px" />
          &nbsp; Export
          <ButtonShortCutDoc doc="E" />
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
        <DialogFooter className="py-2">
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
