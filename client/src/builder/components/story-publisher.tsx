import { Button } from "@/design-system/primitives";
import { usePublishStory } from "../hooks/use-publish-story";
import { ControlledStoryFormDialog } from "./story-form-dialog";
import { AuthModalForm } from "@/auth-modal-form";
import { StoryStatus } from "@/lib/storage/dexie/dexie-db";
import { StoreIcon } from "lucide-react";
import { toast } from "@/design-system/primitives/use-toast";

export const StoryPublisher = ({
  remoteStoryId,
  storyId,
  storyStatus,
}: {
  remoteStoryId?: string;
  storyId: number;
  storyStatus: StoryStatus;
}) => {
  const { handlePublishClick, publish, modal, setModal } = usePublishStory({
    remoteStoryId,
    storyId,
    storyStatus,
  });

  return (
    <>
      <Button variant="outline" className="w-full" onClick={handlePublishClick}>
        <StoreIcon size="16px" />
        &nbsp; Publish
      </Button>
      <ControlledStoryFormDialog
        onSubmit={publish}
        open={modal === "edit-story"}
        setOpen={(open) => setModal(open ? "edit-story" : null)}
      />
      <AuthModalForm
        open={modal === "auth"}
        setOpen={(open) => setModal(open ? "auth" : null)}
        onSuccess={() => {
          setModal(null);
          toast({
            title: "Logged in",
            description: "You successfully logged in!",
          });
        }}
        onError={(err) => {
          console.error(`Error in AuthModal: ${err}`);
          setModal(null);
        }}
      />
    </>
  );
};
