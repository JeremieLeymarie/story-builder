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
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useToast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";

export const ImportModal = () => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | undefined>();

  function handleChange(event: ChangeEvent) {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file != null) {
      reader.onload = function () {
        if (typeof reader.result == "string") {
          setFileContent(reader.result);
        } else {
          console.log(reader.result);
        }
      };
      reader.readAsText(file);
    }
  }

  const importFile = useCallback(async () => {
    try {
      if (typeof fileContent == "string") {
        const contentJson = JSON.parse(fileContent);
        await getLocalRepository().createStory(contentJson.story);
        if (contentJson.scenes) {
          await getLocalRepository().createScenes(contentJson.scenes);
        }
      }
      setFileContent(undefined);
      toast({
        title: "Import complete!",
        description: "Your game is now in your computer.",
      });
    } catch (error) {
      toast({
        title: "Import failed!",
        description: "Something went wrong, please try again later.",
      });
    }
  }, [toast, fileContent]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
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
            ref={fileRef}
            accept="application/JSON"
          />
          <Textarea
            className="h-[40vh] max-h-[72.5vh] min-h-[25vh]"
            placeholder="Your story is write here"
            disabled
            value={fileContent}
          />
        </DialogHeader>
        <DialogFooter>
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
