import { Button } from "@/design-system/primitives";
import { usePublishStory } from "../hooks/use-publish-story";
import { ControlledStoryFormDialog } from "./story-form/story-form-dialog";
import { AuthModalForm } from "@/auth-modal-form";
import { StoreIcon } from "lucide-react";
import { toast } from "@/design-system/primitives/use-toast";
import { ConfirmDialog } from "@/design-system/components";
import { Scene, Story } from "@/lib/storage/domain";

export const StoryPublisher = ({
  story,
  scenes,
}: {
  story: Story;
  scenes: Scene[];
}) => {
  const { handlePublishClick, publish, modal, setModal, updateLocalStory } =
    usePublishStory({
      story,
      scenes,
    });

  return (
    <>
      <div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePublishClick}
          disabled={story.type === "published"}
        >
          <StoreIcon size="16px" />
          &nbsp; Publish
        </Button>
        {story.type === "published" && (
          <p className="p-2 text-sm text-muted-foreground">
            Your story is already published in the store
          </p>
        )}
      </div>
      <ControlledStoryFormDialog
        title="Your story"
        description="Edit your story data before definitively publishing it to the store."
        open={modal === "edit-story"}
        onSubmit={updateLocalStory}
        setOpen={(open) => setModal(open ? "edit-story" : null)}
        defaultValues={story}
      />

      <ConfirmDialog
        title="Are you sure?"
        description="Publishing your story to the store is definitive. You will not be able to modify it once it's published."
        confirmLabel="Publish"
        onConfirm={publish}
        open={modal === "confirm"}
        setOpen={(open) => setModal(open ? "confirm" : null)}
      />

      <AuthModalForm
        open={modal === "auth"}
        setOpen={(open) => setModal(open ? "auth" : null)}
        onSuccess={() => {
          setModal("edit-story");
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
