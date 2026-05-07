import { FileDropInput } from "@/design-system/components/file-input";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives";
import { ANONYMOUS_AUTHOR } from "@/services/common/import-export-service";
import { ReactNode, useState } from "react";
import { Badge } from "../primitives/badge";
import { StoryGenreBadge } from "./story-genre-badge";
import { JsonStoryData } from "@/services/common/schema";

const ImportPreview = ({
  storyFromImport,
}: {
  storyFromImport: JsonStoryData;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <Badge>Preview</Badge>
      <div className="flex gap-2 rounded border p-2 text-sm">
        <img
          src={storyFromImport.story.image}
          className="block h-20 w-20 object-cover"
        />
        <div>
          <p className="font-semibold">{storyFromImport.story.title}</p>
          <p>
            Written by{" "}
            {storyFromImport.story.author?.username ??
              ANONYMOUS_AUTHOR.username}
          </p>
          <div className="flex gap-2">
            {storyFromImport.story.genres.map((genre) => (
              <StoryGenreBadge key={genre} variant={genre} />
            ))}
          </div>
          <p>{storyFromImport.scenes.length} scenes</p>
        </div>
      </div>
    </div>
  );
};

type ImportModalProps = {
  onImportStory: (story: JsonStoryData) => Promise<void>;
  parseFile: (content: string) => JsonStoryData | null;
  trigger: ReactNode;
};

export const ImportModal = ({
  onImportStory,
  parseFile,
  trigger,
}: ImportModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyFromImport, setStoryFromImport] = useState<JsonStoryData | null>(
    null,
  );

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setStoryFromImport(null);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2">
            Import your story
          </DialogTitle>
        </DialogHeader>
        {storyFromImport ? (
          <ImportPreview storyFromImport={storyFromImport} />
        ) : (
          <FileDropInput
            accept="json"
            readAs="text"
            onUploadFile={(content) => {
              // TODO: test what happens when parsing fails
              if (content) setStoryFromImport(parseFile(content));
            }}
          />
        )}
        <DialogFooter className="pt-2">
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              setStoryFromImport(null);
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={!storyFromImport}
            onClick={() => {
              setIsModalOpen(false);
              onImportStory(storyFromImport!);
            }}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
