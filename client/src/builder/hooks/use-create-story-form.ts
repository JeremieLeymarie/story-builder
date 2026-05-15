import { STORY_GENRES, STORY_TYPE } from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

export const createStorySchema = z.object({
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
});

export type CreateStorySchema = z.infer<typeof createStorySchema>;

export const useCreateStoryForm = () => {
  const form = useForm<CreateStorySchema>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  return form;
};

export type StoryFormType = UseFormReturn<CreateStorySchema>;
