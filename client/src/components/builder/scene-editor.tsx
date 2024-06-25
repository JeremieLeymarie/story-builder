import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useState } from "react";
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
import { Action } from "@/lib/storage/dexie-db";
import { PlusIcon, TrashIcon } from "lucide-react";
import { FormError } from "@/design-system/components";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Title has to be at least 2 characters" })
    .max(50, { message: "Title has to be less than 50 characters" }),
  content: z
    .string()
    .min(10, { message: "Content has to be at least 10 characters" })
    .max(8000, { message: "Content has to be less than 10 000 characters" }),
  actions: z.array(
    z.object({
      text: z
        .string()
        .min(3, { message: "Action text has to be at least 3 characters" }),
    })
  ),
});
type Schema = z.infer<typeof schema>;

type Props = {
  defaultValues?: { title?: string; content?: string; actions: Action[] };
  trigger: ReactNode;
  onSave: (input: Schema) => void;
};

export const SceneEditor = ({ defaultValues, trigger, onSave }: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    name: "actions",
    control: form.control,
  });

  const [open, setOpen] = useState(false);

  const submit = useCallback(
    (values: Schema) => {
      onSave(values);
      setOpen(false);
    },
    [onSave]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      {/* TODO: improve scrollbar, maybe by using the ScrollArea ShadCN UI component */}
      <DialogContent className="max-h-[calc(100vh-100px)] overflow-y-scroll">
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

            <div>
              <div className="flex gap-2 items-center mb-2">
                <p className="font-bold text-md">Actions</p>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => append({ text: "" })}
                >
                  <PlusIcon size="18px" />
                </Button>
              </div>
              <hr />
              <FormDescription className="my-2">
                Buttons that allow the player to move in your story
              </FormDescription>
              {fields.map((field, index) => (
                <FormItem className="my-4" key={field.id}>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Go to the village"
                      {...form.register(`actions.${index}.text` as const)}
                      {...field}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon size="18px" />
                    </Button>
                  </div>

                  {!!form.formState.errors.actions?.[index]?.text && (
                    <FormError>
                      {form.formState.errors.actions?.[index]?.text?.message}
                    </FormError>
                  )}
                </FormItem>
              ))}
            </div>
            <Button variant="outline" type="submit">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
