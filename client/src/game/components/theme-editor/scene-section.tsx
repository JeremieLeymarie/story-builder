import { ColorPicker } from "@/design-system/components";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/design-system/primitives";
import { ThemeEditorForm } from "@/game/hooks/use-theme-editor-form";

// TODO: add images
export const SceneSection = ({ form }: { form: ThemeEditorForm }) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="scene.background.color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background color</FormLabel>
              <FormControl>
                <ColorPicker
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scene.textColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text color</FormLabel>
              <FormControl>
                <ColorPicker
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
