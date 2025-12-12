import { ColorPicker } from "@/design-system/components";
import { FileDropInput } from "@/design-system/components/file-input";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { ThemeEditorForm } from "@/game/hooks/use-theme-editor-form";
import { ImageOffIcon } from "lucide-react";

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
          name="scene.text.color"
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
      <FormField
        control={form.control}
        name="scene.background.image"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between">
              <FormLabel>Background image</FormLabel>
              <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => field.onChange(null)}
              >
                <ImageOffIcon />
              </Button>
            </div>
            <FormControl>
              <div className="flex flex-col items-center">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  onChange={(v) => field.onChange(v.target.value || null)}
                  value={field.value || ""}
                />
                <p className="text-muted-foreground">--- OR ---</p>
                <FileDropInput
                  onUploadFile={(v) => field.onChange(v || null)}
                  size="sm"
                  accept="image"
                  readAs="dataURL"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
