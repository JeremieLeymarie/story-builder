import {
  ACTION_BUTTON_SIZES,
  StoryTheme,
  TITLE_SIZES,
} from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEditTheme } from "./use-edit-theme";
import { hexColorValidator } from "@/lib/validation";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";

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
  scene: z.object({
    background: z.object({
      color: hexColorValidator,
      image: z.url().optional().nullable(),
    }),
    text: z.object({
      color: hexColorValidator,
      backgroundColor: hexColorValidator.optional().nullable(),
    }),
  }),
});

export const useThemeEditorForm = ({
  theme,
  storyKey,
}: {
  theme: StoryTheme["theme"];
  storyKey: string;
}) => {
  const { editTheme } = useEditTheme();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: theme,
  });

  useAutoSubmitForm({
    form,
    onSubmit: (data) =>
      editTheme({
        theme: data,
        storyKey,
      }),
  });

  return form;
};

export type ThemeEditorSchema = z.infer<typeof schema>;
export type ThemeEditorForm = ReturnType<typeof useThemeEditorForm>;
