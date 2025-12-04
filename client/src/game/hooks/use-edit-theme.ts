import { getThemeService } from "@/domains/builder/theme-service";
import { StoryTheme } from "@/lib/storage/domain";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditTheme = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      storyKey,
      theme,
    }: {
      storyKey: string;
      theme: StoryTheme["theme"];
    }) => getThemeService().updateTheme(storyKey, theme),
    onSuccess: () => {
      toast.success("Theme successfully updated!");
    },
    onError: () => {
      toast.error("Error: could not update the theme");
    },
  });

  return { editTheme: mutateAsync, isLoading: isPending };
};
