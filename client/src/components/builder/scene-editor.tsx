import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
} from "@/design-system/primitives";
import { ReactNode } from "@tanstack/react-router";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Title has to be less than 2 characters" })
    .max(50, { message: "Title has to be less than 50 characters" }),
  content: z
    .string()
    .min(10, { message: "Content has to be more than 10 characters" })
    .max(8000, { message: "Content has to be less than 10 000 characters" }),
});
type Schema = z.infer<typeof schema>;

type Props = {
  defaultValues?: { title?: string; content?: string };
  trigger: ReactNode;
  onSave: (input: Schema) => void;
};

export const SceneEditor = ({ defaultValues, trigger, onSave }: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = useCallback(
    (values: Schema) => {
      onSave(values);
    },
    [onSave]
  );

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {defaultValues ? (
            <DialogTitle>Edit scene [{defaultValues.title}]</DialogTitle>
          ) : (
            <DialogTitle>New scene</DialogTitle>
          )}
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
                      placeholder="A very suspicious crossroads"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The displayed title of the scene
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You're at a crossroads. On the left, the forest, on the right, the village."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The actual content of the scene.
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
