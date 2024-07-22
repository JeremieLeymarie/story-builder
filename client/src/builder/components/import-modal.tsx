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
import { STORY_STATUS } from "@/lib/storage/dexie/dexie-db";

const schema = z.object({
  story: z.object({
    description: z.string({ message: "Description is required" }),
    id: z.number({ message: "Id is required" }),
    remoteId: z.string().nullable().optional(),
    authorId: z.string().optional(),
    image: z.string().url({ message: "Image has to be a valid URL" }),
    status: z.enum(STORY_STATUS, {
      message: "Status has to be a valid Status",
    }),
    title: z.string({ message: "Title is required" }),
  }),
  scenes: z.array(
    z.object({
      id: z.number(),
      title: z.string({ message: "Id is required" }),
      content: z.string({ message: "Content is required" }),
      actions: z.array(
        z
          .object({
            text: z.string({ message: "Text is required" }),
            sceneId: z.number().optional(),
          })
          .optional()
      ),
      builderParams: z.object({
        position: z.object({
          x: z.number({ message: "X is required" }),
          y: z.number({ message: "Y is required" }),
        }),
      }),
      isFirstScene: z.boolean({ message: "IsFirstScene is required" }),
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
        const resZod = schema.safeParse(contentJson);
        if (!resZod.success) {
          toast({
            title: "Invalid format",
            description: resZod.error.issues[0].message,
          });
          return;
        }
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
