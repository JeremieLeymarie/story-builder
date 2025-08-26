import { useUpdateStory } from "@/builder/hooks/use-update-story";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useStoryForm } from "@/builder/hooks/use-story-form";
import { StoryForm } from "../../story-form";

export const StoryEditor = () => {
  const { story } = useBuilderContext();
  const { updateStory, isPending } = useUpdateStory();
  const form = useStoryForm({ defaultValues: story });

  return (
    <StoryForm
      form={form}
      onSubmit={(payload) => updateStory({ key: story.key, payload })}
      isSubmitting={isPending}
    />
  );
};
