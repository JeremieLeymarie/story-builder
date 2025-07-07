import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod/v4";
import { ReactNode, useCallback, useEffect, useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives";
import { PlusIcon, TrashIcon } from "lucide-react";
import { FormError } from "@/design-system/components";
import { SetFirstSceneSwitch } from "./set-first-scene-switch";
import { Action } from "@/lib/storage/domain";
import { cn } from "@/lib/style";
import { Editor } from "@/components/blocks/editor-00/editor";
import { contentSchema } from "@/lib/scene-content";
import { SerializedEditorState } from "lexical";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Title has to be at least 2 characters" })
    .max(50, { message: "Title has to be less than 50 characters" }),
  content: contentSchema,
  actions: z.array(
    z.object({
      text: z
        .string()
        .min(3, { message: "Action text has to be at least 3 characters" }),
      sceneKey: z.string().optional(),
    }),
  ),
});
export type SceneEditorSchema = z.infer<typeof schema>;

type SceneEditorProps = {
  defaultValues?: {
    title?: string;
    content?: Record<string, unknown>;
    actions: Action[];
    isFirstScene: boolean;
    key: string;
  };
  trigger?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onSave: (input: SceneEditorSchema) => void;
  setFirstScene?: () => void;
  triggerClassName?: string;
};

export const SceneEditor = ({
  defaultValues,
  trigger,
  onSave,
  triggerClassName,
  setFirstScene,
  open,
  setOpen,
}: SceneEditorProps) => {
  const form = useForm<SceneEditorSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { title: "", content: {}, actions: [] },
  });

  const { fields, append, remove } = useFieldArray({
    name: "actions",
    control: form.control,
  });

  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpen = setOpen !== undefined ? setOpen : setInternalOpen;

  // Reset form to empty values when opening for new scene creation
  useEffect(() => {
    if (isOpen && !defaultValues) {
      form.reset({ title: "", content: {}, actions: [] });
    }
  }, [isOpen, defaultValues, form]);

  useEffect(() => {
    // Update the form when the default values change, which are 'cached' otherwise
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const isEditing = !!defaultValues;

  const submit = useCallback(
    (values: SceneEditorSchema) => {
      onSave(values);
      handleOpen(false);
    },
    [handleOpen, onSave],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      {!!trigger && (
        <DialogTrigger
          className={cn("cursor-pointer", triggerClassName)}
          asChild
        >
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[75vw] lg:max-w-[800px]">
        <DialogHeader className="pb-6">
          {isEditing ? (
            <DialogTitle>Edit scene '{defaultValues.title}'</DialogTitle>
          ) : (
            <DialogTitle>New scene</DialogTitle>
          )}
          {isEditing && setFirstScene && (
            <SetFirstSceneSwitch
              isFirstScene={!!defaultValues?.isFirstScene}
              setFirstScene={setFirstScene}
            />
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className="flex gap-8">
              <div className="w-7/12 space-y-4">
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
                        <Editor
                          onSerializedChange={(data) => {
                            field.onChange(data);
                          }}
                          editorSerializedState={
                            field.value as unknown as SerializedEditorState
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        The actual content of the scene.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-5/12 space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-md font-bold">Actions</p>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => append({ text: "" })}
                    >
                      <PlusIcon size="18px" />
                    </Button>
                  </div>
                  <hr />
                </div>

                <FormDescription className="my-2">
                  Buttons that allow the player to move in your story
                </FormDescription>
                <div>
                  {fields.map((field, index) => (
                    <FormItem className="my-2" key={field.id}>
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
                          {
                            form.formState.errors.actions?.[index]?.text
                              ?.message
                          }
                        </FormError>
                      )}
                    </FormItem>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
