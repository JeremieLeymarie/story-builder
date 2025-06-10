import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon, TestTubesIcon } from "lucide-react";
import { useToolbar } from "../hooks/use-toolbar";
import { ExportModal } from "./export-modal";
import { Scene, Story } from "@/lib/storage/domain";
import { DeleteModal } from "./delete-modal";
import { useAddSceneEditorStore } from "../hooks/use-add-scene-editor-store";

type Props = {
  story: Story;
  scenes: Scene[];
};
export const Toolbar = ({ story, scenes }: Props) => {
  const { testStory, deleteStory } = useToolbar({ storyKey: story.key });
  const { setOpen: openAddSceneEditor } = useAddSceneEditorStore();

  // Maybe we could use Navigation Menu for this component at some point
  return (
    <div className="w-[275px] border-r p-2">
      <p className="text-primary text-2xl font-semibold">Tools</p>
      <hr />
      <div className="mt-2 flex w-full flex-col gap-4">
        <Button
          className="flex w-full justify-between"
          onClick={() => openAddSceneEditor(true)}
        >
          <div className="flex items-center">
            <BookOpenTextIcon size="16px" />
            &nbsp; Add a scene
          </div>
          <div className="text-muted-foreground border-secondary bg-secondary/50 rounded-sm px-2 py-1 text-xs">
            N
          </div>
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => testStory(story.firstSceneKey)}
        >
          <TestTubesIcon size="16px" /> &nbsp; Test
        </Button>
        <ExportModal story={story} scenes={scenes} />
        <DeleteModal deleteStory={deleteStory} />
      </div>
    </div>
  );
};
