import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon, SettingsIcon, TestTubesIcon } from "lucide-react";
import { useToolbar } from "../hooks/use-toolbar";
import { ExportModal } from "./export-modal";
import { DeleteModal } from "./delete-modal";
import { ButtonShortCutDoc } from "@/design-system/components/shortcut-doc";
import { useBuilderContext } from "../hooks/use-builder-context";
import { useBuilderEditorStore } from "../hooks/use-scene-editor-store";
import { Toolbar, ToolbarTitle } from "@/design-system/components/toolbar";
import { useAddScene } from "../hooks/use-add-scene";

export const BuilderMenu = () => {
  const { story } = useBuilderContext();
  const { testStory, deleteStory } = useToolbar({ storyKey: story.key });
  const { addScene } = useAddScene();
  const openBuilderEditor = useBuilderEditorStore((state) => state.open);

  const btnClassname = "flex w-full justify-start gap-4";
  return (
    <Toolbar className="w-[250px]">
      <ToolbarTitle>Tools</ToolbarTitle>
      <p className="text-muted-foreground mb-2 truncate italic">
        {story.title}
      </p>
      <div className="mt-2 flex w-full flex-col gap-2">
        <Button
          size="sm"
          className={btnClassname}
          onClick={() => {
            addScene({ position: "auto" });
          }}
        >
          <BookOpenTextIcon />
          Add a scene
          <ButtonShortCutDoc doc="N" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={btnClassname}
          onClick={() => testStory(story.firstSceneKey)}
        >
          <TestTubesIcon />
          Test
          <ButtonShortCutDoc doc="T" />
        </Button>
        <ExportModal />
        <Button
          className={btnClassname}
          size="sm"
          variant="outline"
          onClick={() =>
            openBuilderEditor({ type: "story-editor", payload: null })
          }
        >
          <SettingsIcon />
          Edit story
        </Button>
        <DeleteModal deleteStory={deleteStory} />
      </div>
    </Toolbar>
  );
};
