import { STORY_GENRES } from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

const createStorySchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" }),
  description: z
    .preprocess(
      (v: string | undefined) => (typeof v === "string" ? v.trim() : undefined),
      z.string().optional(),
    )
    .optional(),
  image: z
    .preprocess(
      (v: string | undefined) =>
        typeof v === "string" ? v.trim() || undefined : undefined,
      z.url({ message: "Image has to be a valid URL" }).optional(),
    )
    .optional(),
  genres: z
    .array(z.enum(STORY_GENRES), {
      error: "You must select at least of genre for your story",
    })
    .optional(),
});

export type CreateStorySchemaInput = z.input<typeof createStorySchema>;
export type CreateStorySchemaOutput = z.output<typeof createStorySchema>;

export const useCreateStoryForm = ({
  onSubmit,
}: {
  onSubmit: (props: CreateStorySchemaOutput) => void;
}) => {
  const form = useForm<
    CreateStorySchemaInput,
    unknown,
    CreateStorySchemaOutput
  >({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      genres: [],
    },
  });

  const submit = form.handleSubmit(onSubmit);

  return { form, submit };
};

export type StoryFormType = UseFormReturn<
  CreateStorySchemaInput,
  unknown,
  CreateStorySchemaOutput
>;
