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
import { useQuery } from "@tanstack/react-query";
import { getBuilderService } from "@/get-builder-service";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { PropsWithChildren } from "react";

export const ExportModal = ({ storyKey }: { storyKey: string }) => {
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
        <ExportModalContent storyKey={storyKey} />
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

export const ExportModalContent = ({ storyKey }: { storyKey: string }) => {
  const { setOpen } = useExportModalStore();
  const {
    data,
    isPending,
    isLoading: isLoading_,
  } = useQuery({
    queryKey: ["EXPORT-MODAL", storyKey],
    queryFn: async () => {
      const { story, scenes } =
        await getBuilderService().getBuilderStoryData(storyKey);

      if (!story) {
        toast.error("Something went wrong");
        return null;
      }
      return { exportData: getExportData({ story, scenes }), story };
    },
  });

  const isLoading = isLoading_ || isPending || data === undefined;

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
