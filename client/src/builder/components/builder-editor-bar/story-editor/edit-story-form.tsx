import { EditStoryFormType } from "@/builder/hooks/use-edit-story-form";
import { StoryGenreCombobox } from "@/design-system/components/story-genre-combobox";
import {
  Button,
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
import { BaseSyntheticEvent } from "react";

export const EditStoryForm = ({
  onSubmit,
  form,
  isSubmitting = false,
}: {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isSubmitting?: boolean;
  form: EditStoryFormType;
}) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="The Great Journey To The Green River"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The displayed title of your story
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <StoryGenreCombobox
                  onChange={field.onChange}
                  values={field.value}
                />
              </FormControl>
              <FormDescription>The genre(s) of your story</FormDescription>
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
                />
              </FormControl>
              <FormDescription>
                A short description of your story
              </FormDescription>
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
              <FormControl>
                <Input placeholder="http://your-image-url.com" {...field} />
              </FormControl>
              <FormDescription>The cover image for your story</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
};
