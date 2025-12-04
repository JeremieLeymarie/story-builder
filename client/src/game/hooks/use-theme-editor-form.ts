import {
  ACTION_BUTTON_SIZES,
  StoryTheme,
  TITLE_SIZES,
} from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEditTheme } from "./use-edit-theme";
import { DEFAULT_STORY_THEME } from "@/domains/builder/story-theme";
import { hexColorValidator } from "@/lib/validation";

const schema = z.object({
  title: z.object({
    hidden: z.boolean(),
    size: z.enum(TITLE_SIZES),
    color: hexColorValidator,
  }),
  action: z.object({
    backgroundColor: hexColorValidator,
    textColor: hexColorValidator,
    size: z.enum(ACTION_BUTTON_SIZES),
  }),
});

export const useThemeEditorForm = ({
  theme,
  storyKey,
}: {
  theme: StoryTheme["theme"];
  storyKey: string;
}) => {
  const { editTheme, isLoading } = useEditTheme();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: theme,
  });

  const onSubmit = form.handleSubmit((data) =>
    editTheme({
      theme: {
        title: data.title,
        action: data.action,
        scene: DEFAULT_STORY_THEME.scene, // TODO: use real values from form
      },
      storyKey,
    }),
  );

  return { form, onSubmit, isEditing: isLoading };
};

export type ThemeEditorSchema = z.infer<typeof schema>;
export type ThemeEditorForm = ReturnType<typeof useThemeEditorForm>["form"];
