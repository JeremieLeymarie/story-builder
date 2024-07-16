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
import { useToast } from "@/design-system/primitives/use-toast";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { z } from "zod";

const schema = z.object({
  story: z.object({
    authorId: z.number(),
    description: z.string(),
    id: z.number(),
    image: z.string().url({ message: "Image has to be a valid URL" }),
    mongoId: z.string(),
    status: z.string(),
    title: z.string(),
    scenes: z.array(z.object({}).optional()),
  }),
  scenes: z.array(
    z.object({
      id: z.number(),
      mongoId: z.string().nullable().optional(),
      storyId: z.number(),
      title: z.string(),
      content: z.string(),
      actions: z.array(
        z
          .object({
            text: z.string(),
            sceneId: z.number().optional(),
          })
          .optional()
      ),
      builderParams: z.object({
        position: z.object({
          x: z.number(),
          y: z.number(),
        }),
      }),
      isFirstScene: z.boolean(),
    })
  ),
});

export const ImportModal = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | undefined>();

  const handleChange = (event: ChangeEvent) => {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file != null) {
      reader.onload = function () {
        if (typeof reader.result == "string") {
          setFileContent(reader.result);
        } else {
          console.error("error when reading file :" + reader.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const importFile = useCallback(async () => {
    try {
      setFileContent(undefined);
      if (fileContent) {
        const contentJson = JSON.parse(fileContent);
        schema.parse(contentJson);
        await getLocalRepository().createStory(contentJson.story);
        if (contentJson.scenes) {
          await getLocalRepository().createScenes(contentJson.scenes);
        }
      }
      toast({
        title: "Import complete!",
        description: "Game was successfully downloaded on this device.",
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
            accept="application/JSON"
          />
          <Textarea
            className="h-[40vh] max-h-[72.5vh] min-h-[25vh]"
            placeholder="Your story JSON will appear here"
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
