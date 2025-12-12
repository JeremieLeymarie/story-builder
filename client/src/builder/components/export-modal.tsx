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
import { ButtonShortCutDoc } from "@/design-system/components/shortcut-doc";

import { toast } from "sonner";
import { useExportModalStore } from "../hooks/use-export-modal-store";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { PropsWithChildren } from "react";
import { useGetExportData } from "../hooks/use-get-export-data";

export const ExportModal = () => {
  const { isOpen, setOpen } = useExportModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-4"
          size="sm"
        >
          <DownloadIcon />
          Export
          <ButtonShortCutDoc doc="E" />
        </Button>
      </DialogTrigger>
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
