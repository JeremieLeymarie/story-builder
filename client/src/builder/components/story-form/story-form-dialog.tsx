import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { WithoutKey } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StoryGenreCombobox } from "./story-genre-combobox";
import { schema, Schema } from "./schema";
import { Story } from "@/lib/storage/domain";

export const StoryFormDialog = (
  props: Omit<StoryFormProps, "trigger"> & { trigger: JSX.Element },
) => {
  const [open, setOpen] = useState(false);

  return <ControlledStoryFormDialog {...props} open={open} setOpen={setOpen} />;
};

export type OnSubmitStoryFormProps = Omit<
  WithoutKey<Story>,
  "firstSceneKey" | "author" | "status" | "publicationDate" | "creationDate"
> & { firstSceneKey?: string };
type StoryFormProps = {
  onSubmit: (props: OnSubmitStoryFormProps) => void;
  trigger?: JSX.Element;
  defaultValues?: Schema;
  title: string;
  description: string;
};

export const ControlledStoryFormDialog = ({
  onSubmit,
  trigger,
  defaultValues,
  setOpen,
  open,
  title,
  description,
}: StoryFormProps & { open: boolean; setOpen: (open: boolean) => void }) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      image: "",
    },
  });

  const submit = (data: Schema) => {
    onSubmit?.({ ...data });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader className="p-1">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
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
                  <FormDescription>
                    The cover image for your story
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
