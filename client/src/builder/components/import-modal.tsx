import { getLibraryService } from "@/domains/game/library-service";
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
import { BracesIcon } from "lucide-react";
import { ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";

export const ImportModal = () => {
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

  const importFile = useCallback(async () => {
    if (!fileContent) {
      return toast.error("No content in file.");
    }

    const { error } = await getLibraryService().importFromJSON(fileContent);
    if (error) return toast.error("Import failed!", { description: error });

    toast.success("Import complete!", {
      description: "Game was successfully downloaded on this device.",
    });
  }, [fileContent]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <BracesIcon size="16px" />
          &nbsp; Import from JSON
        </Button>
      </DialogTrigger>
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
          <Textarea
            className="h-[40vh] max-h-[72.5vh] min-h-[25vh]"
            placeholder="Your story JSON will appear here"
            disabled
            value={fileContent}
          />
        </DialogHeader>
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
              importFile();
            }}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
