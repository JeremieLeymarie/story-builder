import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Switch,
} from "@/design-system/primitives";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/design-system/primitives/toggle-group";
import { ColorPicker } from "@/design-system/components";
import {
  ThemeEditorForm,
  ThemeEditorSchema,
} from "@/game/hooks/use-theme-editor-form";
import { cn } from "@/lib/style";

export const TitleSection = ({
  form,
  values,
}: {
  form: ThemeEditorForm;
  values: ThemeEditorSchema;
}) => {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="title.hidden"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex gap-2">
                <Switch
                  checked={!field.value}
                  onCheckedChange={(checked) => field.onChange(!checked)}
                />
                <FormLabel>Show titles</FormLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title.size"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(values.title.hidden && "text-muted-foreground")}
            >
              Size
            </FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                value={field.value}
                disabled={values.title.hidden}
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

      <FormField
        control={form.control}
        name="title.color"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(values.title.hidden && "text-muted-foreground")}
            >
              Color
            </FormLabel>
            <FormControl>
              <ColorPicker
                onChange={field.onChange}
                defaultValue={field.value}
                disabled={values.title.hidden}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
