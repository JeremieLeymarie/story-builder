import { StoryTheme } from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditTheme } from "./use-edit-theme";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";
import { gameThemeSchema } from "@/domains/builder/story-theme";

export const useThemeEditorForm = ({
  theme,
  storyKey,
}: {
  theme: StoryTheme["theme"];
  storyKey: string;
}) => {
  const { editTheme } = useEditTheme();
  const form = useForm({
    resolver: zodResolver(gameThemeSchema),
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

export type ThemeEditorForm = ReturnType<typeof useThemeEditorForm>;
