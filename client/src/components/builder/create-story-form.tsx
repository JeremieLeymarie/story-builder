import {
  Button,
  Dialog,
  DialogHeader,
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
import { title } from "process";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  image: z.string(),
});

type Schema = z.infer<typeof schema>;

export const CreateStoryForm = () => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  const submit = (data: Schema) => {
    // TODO:
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> &nbsp;Build your own story
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit scene [{title}]</DialogTitle>
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
                    <Textarea
                      placeholder="http://your-image-url.com"
                      {...field}
                    />
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
