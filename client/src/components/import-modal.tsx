import { FileDropInput } from "@/design-system/components/file-input";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
} from "@/design-system/primitives";
import { ReactNode, useState } from "react";

export const ImportModal = ({
  onImportStory,
  trigger,
}: {
  onImportStory: (fileContent: string) => Promise<void>;
  trigger: ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setFileContent(null);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2">
            Import your story
          </DialogTitle>
        </DialogHeader>
        {fileContent ? (
          <Textarea
            className="h-[40vh] max-h-[72.5vh] min-h-[25vh]"
            placeholder="Your story JSON will appear here"
            disabled
            value={fileContent}
          />
        ) : (
          <FileDropInput onUploadFile={setFileContent} />
        )}
        <DialogFooter className="pt-2">
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              setFileContent(null);
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={!fileContent}
            onClick={() => {
              setIsModalOpen(false);
              onImportStory(fileContent!);
            }}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
