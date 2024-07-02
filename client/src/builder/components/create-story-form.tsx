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
import { Story } from "@/lib/storage/dexie/dexie-db";
import { WithoutId } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  image: z.string().url({ message: "Image has to be a valid URL" }),
});

type Schema = z.infer<typeof schema>;

type CreateStoryFormProps = {
  onCreate: (props: Omit<WithoutId<Story>, "firstSceneId">) => void;
};

export const CreateStoryForm = ({ onCreate }: CreateStoryFormProps) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });
  const [open, setOpen] = useState(false);

  const submit = (data: Schema) => {
    // TODO: use actual authorId when auth is implemented
    onCreate({ ...data, authorId: 1, status: "draft" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> &nbsp;Build your own story
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start building your own adventure! </DialogTitle>
          <DialogDescription>{}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
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
            <Button variant="outline" type="submit">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
