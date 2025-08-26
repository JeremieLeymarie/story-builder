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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StoryGenreCombobox } from "@/design-system/components/story-genre-combobox";
import { StorySchema, storySchema } from "../../story-schema";
import { useUpdateStory } from "@/builder/hooks/use-update-story";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";

type StoryFormProps = {
  defaultValues: StorySchema;
};

export const StoryForm = ({ defaultValues }: StoryFormProps) => {
  const form = useForm<StorySchema>({
    resolver: zodResolver(storySchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      image: "",
    },
  });
  const { story } = useBuilderContext();
  const { updateStory, isPending } = useUpdateStory();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          updateStory({ key: story.key, payload: data }),
        )}
        className="space-y-4"
      >
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
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
      </form>
    </Form>
  );
};
