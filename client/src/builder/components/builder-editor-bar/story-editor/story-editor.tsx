import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useEditStoryForm } from "@/builder/hooks/use-edit-story-form";
import { EditStoryForm } from "./edit-story-form";
import {
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/design-system/primitives";
import { DeleteStoryModal } from "../../delete-modal";
import { useDeleteStory } from "@/builder/hooks/use-delete-story";

export const StoryEditorHeader = () => {
  const { deleteStory } = useDeleteStory();

  return (
    <ToolbarHeader className="flex-row items-center justify-between">
      <ToolbarTitle>Edit story</ToolbarTitle>
      <DeleteStoryModal
        deleteStory={deleteStory}
        trigger={
          <Button size="icon" variant="ghost">
            <Trash2Icon />
          </Button>
        }
      />
    </ToolbarHeader>
  );
};

export const StoryEditor = () => {
  const { story } = useBuilderContext();
  const { form, handleSubmit, isSubmitting } = useEditStoryForm({
    defaultValues: story,
  });

  return (
    <EditStoryForm
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
