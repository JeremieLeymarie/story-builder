import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon, TestTubesIcon } from "lucide-react";
import { SceneEditor } from "./editors/scene-editor";
import { useToolbar } from "../hooks/use-toolbar";
import { StoryPublisher } from "./story-publisher";
import { ExportModal } from "./export-modal";
import { Scene, Story } from "@/lib/storage/domain";
import { getBuilderService } from "@/services";
import { useBuilderContext } from "../hooks/use-builder-store";

type Props = {
  story: Story;
  scenes: Scene[];
};
export const Toolbar = ({ story, scenes }: Props) => {
  const { testStory } = useToolbar({ storyKey: story.key });
  const { refresh } = useBuilderContext();

  // Maybe we could use Navigation Menu for this component at some point
  return (
    <div className="w-[275px] border-r p-2">
      <p className="text-2xl font-semibold text-primary">Tools</p>
      <hr />
      <div className="mt-2 flex w-full flex-col gap-4">
        <SceneEditor
          trigger={
            <Button className="w-full">
              <BookOpenTextIcon size="16px" />
              &nbsp; Add a scene
            </Button>
          }
          triggerClassName="w-full"
          onSave={(values) => {
            getBuilderService().addScene({
              ...values,
              storyKey: story.key,
              builderParams: { position: { x: 0, y: 0 } },
            });
            refresh();
          }}
        />
        <Button variant="outline" className="w-full" onClick={testStory}>
          <TestTubesIcon size="16px" /> &nbsp; Test
        </Button>
        <StoryPublisher story={story} scenes={scenes} />
        <ExportModal story={story} scenes={scenes} />
      </div>
    </div>
  );
};
