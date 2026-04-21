import { FileDropInput } from "@/design-system/components/file-input";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/design-system/primitives";
import { ANONYMOUS_AUTHOR } from "@/services/common/import-export-service";
import { ReactNode, useState } from "react";
import { Badge } from "../primitives/badge";
import { StoryGenreBadge } from "./story-genre-badge";
import { JsonStoryData } from "@/services/common/schema";

const ImportPreview = ({
  storyFromImport,
  title,
  onTitleChange,
}: {
  storyFromImport: JsonStoryData;
  title: string;
  onTitleChange: (title: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <Badge>Preview</Badge>
      <div className="flex gap-2 rounded border p-2 text-sm">
        <img
          src={storyFromImport.story.image}
          className="block h-20 w-20 object-cover"
        />
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-semibold"
          />
          <p className="mt-1">
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
  const [title, setTitle] = useState("");

  const reset = () => {
    setStoryFromImport(null);
    setTitle("");
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) reset();
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
          <ImportPreview
            storyFromImport={storyFromImport}
            title={title}
            onTitleChange={setTitle}
          />
        ) : (
          <FileDropInput
            accept="json"
            readAs="text"
            onUploadFile={(content) => {
              // TODO: test what happens when parsing fails
              if (content) {
                const parsed = parseFile(content);
                setStoryFromImport(parsed);
                if (parsed) setTitle(parsed.story.title);
              }
            }}
          />
        )}
        <DialogFooter className="pt-2">
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={!storyFromImport || !title.trim()}
            onClick={() => {
              setIsModalOpen(false);
              onImportStory({
                ...storyFromImport!,
                story: { ...storyFromImport!.story, title: title.trim() },
              });
            }}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
