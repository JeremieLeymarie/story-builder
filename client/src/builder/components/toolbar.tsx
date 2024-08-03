import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon, SaveIcon, TestTubesIcon } from "lucide-react";
import { SceneEditor } from "./editors/scene-editor";
import { useToolbar } from "../hooks/use-toolbar";
import { AuthModalForm } from "@/auth-modal-form";
import { StoryPublisher } from "./story-publisher";
import { ExportModal } from "./export-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { Scene, Story } from "@/lib/storage/domain";
import { getBuilderService } from "@/services/builder";

type Props = {
  story: Story;
  scenes: Scene[];
};
export const Toolbar = ({ story, scenes }: Props) => {
  const { synchronize, isAuthModalOpen, setIsAuthModalOpen, testStory } =
    useToolbar({ storyKey: story.key });

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
          onSave={(values) =>
            getBuilderService().addScene({
              ...values,
              storyKey: story.key,
              builderParams: { position: { x: 0, y: 0 } },
            })
          }
        />
        <Button variant="outline" className="w-full" onClick={testStory}>
          <TestTubesIcon size="16px" /> &nbsp; Test
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                className="w-full"
                onClick={synchronize}
                disabled={story.status === "published"}
              >
                <SaveIcon size="16px" /> &nbsp; Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Save your progress on all your devices and browsers.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <StoryPublisher story={story} scenes={scenes} />
        <ExportModal story={story} scenes={scenes} />
      </div>
      <AuthModalForm
        open={isAuthModalOpen}
        setOpen={setIsAuthModalOpen}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          synchronize();
        }}
        onError={(err) => {
          setIsAuthModalOpen(false);
          console.error(`Error in AuthModal: ${err}`);
        }}
      />
    </div>
  );
};
