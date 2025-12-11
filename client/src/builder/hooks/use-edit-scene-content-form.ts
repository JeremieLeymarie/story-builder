import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { Scene } from "@/lib/storage/domain";
import z from "zod";
import { lexicalContentSchema } from "@/lib/lexical-content";

export const sceneSchema = z.object({
  title: z
    .string()
    .max(250, { message: "Title has to be less than 250 characters" }),
  content: lexicalContentSchema,
});

export type SceneSchema = z.infer<typeof sceneSchema>;

export type SceneUpdatePayload = Omit<Scene, "builderParams" | "actions">;

export const useEditSceneContentForm = ({
  defaultValues,
  onSave,
}: {
  defaultValues: Partial<SceneSchema>;
  onSave: (payload: SceneSchema) => void;
}) => {
  const form = useForm<SceneSchema>({
    resolver: zodResolver(sceneSchema),
    defaultValues,
  });

  const debouncer = useDebouncer(
    () => {
      form.handleSubmit((values: SceneSchema) => {
        onSave({
          content: values.content,
          title: values.title,
        });
      })();
    },
    { wait: 500 },
    () => {}, // Never re-render when internal debouncer state changes
  );

  useEffect(() => {
    // Update the form when the default values change, which are 'cached' otherwise
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, debouncer, form]);

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: debouncer.maybeExecute,
    });
    return () => callback();
  }, [defaultValues, debouncer, form]);

  return form;
};
