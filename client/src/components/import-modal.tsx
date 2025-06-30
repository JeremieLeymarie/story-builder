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
import { ChangeEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

export const ImportModal = ({
  onImportStory,
  trigger,
}: {
  onImportStory: (fileContent: string) => Promise<void>;
  trigger: ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | undefined>();

  const handleChange = (event: ChangeEvent) => {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      reader.onload = function () {
        if (typeof reader.result === "string") {
          setFileContent(reader.result);
        } else {
          console.error("error when reading file :" + reader.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const importStory = async () => {
    if (!fileContent) {
      return toast.error("No content in file.");
    }
    onImportStory(fileContent);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Import your story
          </DialogTitle>
          <input
            type="file"
            onChange={handleChange}
            accept="application/JSON"
          />
        </DialogHeader>
        <Textarea
          className="h-[40vh] max-h-[72.5vh] min-h-[25vh]"
          placeholder="Your story JSON will appear here"
          disabled
          value={fileContent}
        />
        <DialogFooter className="pt-2">
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              setFileContent(undefined);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              setIsModalOpen(false);
              importStory();
            }}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
