import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useEditStoryForm } from "@/builder/hooks/use-edit-story-form";
import { EditStoryForm } from "./edit-story-form";

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
