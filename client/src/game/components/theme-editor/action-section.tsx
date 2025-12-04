import { ColorPicker } from "@/design-system/components";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/design-system/primitives";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/design-system/primitives/toggle-group";
import { ThemeEditorForm } from "@/game/hooks/use-theme-editor-form";

export const ActionSection = ({ form }: { form: ThemeEditorForm }) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="action.backgroundColor"
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
          name="action.textColor"
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
        name="action.size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Size</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                value={field.value}
              >
                <ToggleGroupItem size="sm" value="small" variant="outline">
                  Small
                </ToggleGroupItem>
                <ToggleGroupItem size="sm" value="medium" variant="outline">
                  Medium
                </ToggleGroupItem>
                <ToggleGroupItem size="sm" value="large" variant="outline">
                  Large
                </ToggleGroupItem>
                <ToggleGroupItem size="sm" value="huge" variant="outline">
                  Huge
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
