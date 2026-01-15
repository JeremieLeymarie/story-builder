import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scene } from "@/lib/storage/domain";
import z from "zod";
import { lexicalContentSchema } from "@/lib/lexical-content";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";

export const sceneSchema = z.object({
  title: z
    .string()
    .max(250, { message: "Title has to be less than 250 characters" }),
  content: lexicalContentSchema,
});

export type SceneSchema = z.infer<typeof sceneSchema>;

export type SceneUpdatePayload = Omit<Scene, "builderParams" | "actions">;

export const useEditSceneContentForm = ({
  values,
  onSave,
}: {
  values: SceneSchema;
  onSave: (payload: SceneSchema) => void;
}) => {
  const form = useForm<SceneSchema>({
    resolver: zodResolver(sceneSchema),
    values,
  });

  useAutoSubmitForm({
    form,
    onSubmit: (values) =>
      onSave({
        content: values.content,
        title: values.title,
      }),
  });

  return form;
};

export type SceneContentFormType = ReturnType<typeof useEditSceneContentForm>;
