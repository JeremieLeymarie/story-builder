import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { StorySchema, storySchema } from "../components/story-schema";

export const useStoryForm = ({
  defaultValues,
}: {
  defaultValues?: StorySchema;
}) => {
  const form = useForm<StorySchema>({
    resolver: zodResolver(storySchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      image: "",
    },
  });

  return form;
};

export type StoryFormType = UseFormReturn<StorySchema>;
