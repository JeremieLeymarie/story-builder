import { StoryGenreCombobox } from "@/design-system/components/story-genre-combobox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/design-system/primitives";
import { StoryFormType } from "../hooks/use-create-story-form";
import { Separator } from "@/design-system/primitives/separator";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { FileDropInput } from "@/design-system/components/file-input";

const RequiredSymbol = () => <span className="text-destructive">*</span>;

export const CreateStoryForm = ({
  onSubmit,
  form,
}: {
  onSubmit: () => void;
  form: StoryFormType;
}) => {
  const isMobile = useIsMobile();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-120 space-y-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-0.75">
                Title
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="The Great Journey To The Green River"
                  {...field}
                  className="text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isMobile && (
          <>
            <Separator />
            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0.75">Genre</FormLabel>
                  <FormControl>
                    <StoryGenreCombobox
                      onChange={field.onChange}
                      values={field.value ?? []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A wonderful epic tale through the world of Penthetir. "
                      {...field}
                      className="resize-none text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormDescription>
                    The cover image for your story
                  </FormDescription>
                  <FormControl>
                    <div className="flex flex-col items-center gap-1">
                      <Input
                        type="url"
                        placeholder="https://your-image.org"
                        onChange={(v) => field.onChange(v.target.value || null)}
                        value={field.value || ""}
                      />
                      <p className="text-muted-foreground">--- OR ---</p>
                      <FileDropInput
                        onUploadFile={(v) => field.onChange(v || null)}
                        accept="image"
                        readAs="dataURL"
                        size="sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {/* This is a hack to allow automatic form submit when pressing the Enter key */}
        <input type="submit" className="hidden" />
      </form>
    </Form>
  );
};
