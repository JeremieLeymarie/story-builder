import { STORY_GENRES, STORY_TYPE } from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { useUpdateStory } from "./use-update-story";
import { useBuilderContext } from "./use-builder-context";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";

export const editStorySchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  image: z.url({ message: "Image has to be a valid URL" }),
  status: z.enum(STORY_TYPE).optional(),
  genres: z.array(z.enum(STORY_GENRES)),
  firstSceneKey: z.nanoid().optional(),
  wikiKey: z.nanoid().optional(),
});

export type EditStorySchema = z.infer<typeof editStorySchema>;

export const useEditStoryForm = ({
  values,
}: {
  values: EditStorySchema;
}) => {
  const form = useForm<EditStorySchema>({
    resolver: zodResolver(editStorySchema),
    values,
  });
  const { story } = useBuilderContext();

  const { updateStory, isPending } = useUpdateStory();

  useAutoSubmitForm({
    form,
    onSubmit: (payload) => updateStory({ key: story.key, payload }),
  });

  return { form, isSubmitting: isPending };
};

export type EditStoryFormType = UseFormReturn<EditStorySchema>;
