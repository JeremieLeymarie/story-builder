import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { lexicalContentSchema } from "@/lib/lexical-content";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";

const sceneSchema = z.object({
  title: z
    .string()
    .max(250, { message: "Title has to be less than 250 characters" }),
  content: lexicalContentSchema,
});

type SceneContentSchema = z.infer<typeof sceneSchema>;

export const useEditSceneContentForm = ({
  values,
  onSave,
}: {
  values: SceneContentSchema;
  onSave: (payload: SceneContentSchema) => void;
}) => {
  const form = useForm<SceneContentSchema>({
    resolver: zodResolver(sceneSchema),
    values,
  });

  const { isSaving } = useAutoSubmitForm({
    form,
    onSubmit: (values) =>
      onSave({
        content: values.content,
        title: values.title,
      }),
  });

  return { form, isSaving };
};
