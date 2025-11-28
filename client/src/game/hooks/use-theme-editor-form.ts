import { DEFAULT_STORY_THEME } from "@/domains/builder/story-theme";
import { TITLE_SIZES } from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  title: z.object({
    hidden: z.boolean(),
    size: z.enum(TITLE_SIZES),
    color: z.hex(),
  }),
});

export const useThemeEditorForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    // TODO: use values from DB instead of default theme
    defaultValues: DEFAULT_STORY_THEME,
  });

  return form;
};

export type ThemeEditorSchema = z.infer<typeof schema>;
export type ThemeEditorForm = ReturnType<typeof useThemeEditorForm>;
