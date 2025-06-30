import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../design-system/primitives";
import { DownloadIcon, CopyIcon } from "lucide-react";
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

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start" size="sm">
          <DownloadIcon size="16px" />
          &nbsp; Export
          <ButtonShortCutDoc doc="E" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ExportModalContent story={story} scenes={scenes} />
      </DialogContent>
    </Dialog>
  );
};

const getExportData = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  const storyJson = JSON.stringify({ story, scenes }, null, 2);
  const blob = new Blob([storyJson], { type: "text/json" });
  const url = URL.createObjectURL(blob);
  return { url, data: storyJson };
};

export const ExportModalContent = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  const { setOpen } = useExportModalStore();
  const exportData = getExportData({ story, scenes });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Export your story to file
        </DialogTitle>
      </DialogHeader>

      <div className="py-2">
        <p>Your export is ready!</p>
      </div>
      <DialogFooter className="py-2">
        <Button
          variant="secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <>
          <a
            href={exportData.url}
            download={story.title + ".json"}
            onClick={() => {
              toast.success("Export complete!", {
                description: "Your game is now in your computer.",
              });
              setOpen(false);
            }}
          >
            <Button>
              <DownloadIcon size="16px" />
            </Button>
          </a>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(exportData.data);
              toast.success("Copied to clipboard !");
              setOpen(false);
            }}
          >
            <CopyIcon size="16px" />
          </Button>
        </>
      </DialogFooter>
    </>
  );
};
