import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon, TestTubesIcon } from "lucide-react";
import { useToolbar } from "../hooks/use-toolbar";
import { ExportModal } from "./export-modal";
import { DeleteModal } from "./delete-modal";
import { ButtonShortCutDoc } from "@/design-system/components/shortcut-doc";
import { useBuilderContext } from "../hooks/use-builder-context";
import { useAddScene } from "../hooks/use-add-scene";

export const Toolbar = () => {
  const { story } = useBuilderContext();
  const { testStory, deleteStory } = useToolbar({ storyKey: story.key });
  const { addScene } = useAddScene();

  return (
    <div className="z-50 w-[250px] rounded border bg-white/80 p-4 shadow-sm">
      <p className="text-primary text-2xl font-semibold">TOOLS</p>
      <div className="mt-2 flex w-full flex-col gap-2">
        <Button
          size="sm"
          className="flex w-full justify-start"
          onClick={() => {
            addScene({ title: "", content: "", actions: [] });
          }}
        >
          <BookOpenTextIcon size="16px" />
          &nbsp; Add a scene
          <ButtonShortCutDoc doc="N" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex w-full justify-start"
          onClick={() => testStory(story.firstSceneKey)}
        >
          <TestTubesIcon size="16px" />
          &nbsp; Test
          <ButtonShortCutDoc doc="T" />
        </Button>
        <ExportModal storyKey={story.key} />
        <DeleteModal deleteStory={deleteStory} />
      </div>
    </div>
  );
};
