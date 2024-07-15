import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon, RefreshCcwIcon, TestTubesIcon } from "lucide-react";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { SceneEditor } from "./editors/scene-editor";
import { useToolbar } from "../hooks/use-toolbar";
import { AuthModalForm } from "@/auth-modal-form";
import { ExportModal } from "./export-modal";
import { Scene, Story } from "@/lib/storage/dexie/dexie-db";

type Props = { story: Story; scenes: Scene[] };
export const Toolbar = ({ story, scenes }: Props) => {
  const { synchronize, isAuthModalOpen, setIsAuthModalOpen, testStory } =
    useToolbar({
      storyId: story.id,
    });

  return (
    <div className="w-[275px] border-r p-2">
      <p className="text-2xl font-semibold text-primary">Tools</p>
      <hr />
      <div className="mt-2 w-full flex flex-col gap-4">
        <SceneEditor
          trigger={
            <Button variant="outline" className="w-full">
              <BookOpenTextIcon size="16px" />
              &nbsp; Add a scene
            </Button>
          }
          triggerClassName="w-full"
          onSave={(values) =>
            getLocalRepository().createScene({
              ...values,
              storyId: story.id,
              builderParams: { position: { x: 0, y: 0 } },
            })
          }
        />
        <Button variant="outline" className="w-full" onClick={synchronize}>
          <RefreshCcwIcon size="16px" /> &nbsp; Synchronize
        </Button>
        <ExportModal story={story} scenes={scenes} />
        <Button variant="default" className="w-full" onClick={testStory}>
          <TestTubesIcon size="16px" /> &nbsp; Test
        </Button>
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
