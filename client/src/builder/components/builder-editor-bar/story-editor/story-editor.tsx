import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useEditStoryForm } from "@/builder/hooks/use-edit-story-form";
import { EditStoryForm } from "./edit-story-form";
import {
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/design-system/primitives";
import { DeleteStoryModal } from "../../delete-story-modal";
import { SavingIndicator } from "@/design-system/components/saving-indicator";
import { useDeleteStory } from "@/builder/hooks/use-delete-story";

export const StoryEditor = () => {
  const { story } = useBuilderContext();
  const { form, isSaving } = useEditStoryForm({
    values: story,
  });
  const { deleteStory } = useDeleteStory();

  return (
    <Toolbar className="w-[min(400px,calc(100vw-2.5rem))]">
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
      <EditStoryForm form={form} />
      <SavingIndicator isSaving={isSaving} />
    </Toolbar>
  );
};
