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

import { toast } from "sonner";
import { useExportModalStore } from "../hooks/use-export-modal-store";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { PropsWithChildren, ReactNode } from "react";
import { useGetExportData } from "../hooks/use-get-export-data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";

export const ExportModal = ({
  trigger,
  tooltip,
}: {
  trigger: ReactNode;
  tooltip?: string;
}) => {
  const { isOpen, setOpen } = useExportModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
      <DialogContent>
        <ExportModalContent />
      </DialogContent>
    </Dialog>
  );
};

export const ExportModalContent = () => {
  const { setOpen } = useExportModalStore();
  const { data, isLoading } = useGetExportData();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Export your story to file
        </DialogTitle>
      </DialogHeader>

      <div className="flex w-full items-center justify-center py-8">
        {isLoading ? <SimpleLoader /> : <p>Your export is ready!</p>}
      </div>
      <DialogFooter className="py-2">
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <>
          <DownloadLink url={data?.exportData.url} title={data?.story.title}>
            <Button
              disabled={!data?.exportData}
              onClick={() => {
                toast.success("Export complete!", {
                  description: "Your game is now in your computer.",
                });
                setOpen(false);
              }}
            >
              <DownloadIcon size="16px" />
            </Button>
          </DownloadLink>
          <Button
            disabled={!data?.exportData}
            onClick={() => {
              if (data) {
                navigator.clipboard.writeText(data.exportData.data);
                toast.success("Copied to clipboard !");
                setOpen(false);
              }
            }}
          >
            <CopyIcon size="16px" />
          </Button>
        </>
      </DialogFooter>
    </>
  );
};

const DownloadLink = ({
  url,
  title,
  children,
}: PropsWithChildren<{
  url?: string;
  title?: string;
}>) => {
  return url && title ? (
    <a href={url} download={`${title}.json`}>
      {children}
    </a>
  ) : (
    children
  );
};
