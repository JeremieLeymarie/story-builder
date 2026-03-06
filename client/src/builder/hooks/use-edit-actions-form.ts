import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scene } from "@/lib/storage/domain";
import z from "zod";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";
import { actionSchema } from "@/lib/action-schema";

const schema = z.object({ actions: z.array(actionSchema) });

export type EditActionsSchema = z.infer<typeof schema>;

export const useEditActionsForm = ({
  actions,
  onSave,
}: {
  actions: Scene["actions"];
  onSave: (payload: { actions: Scene["actions"] }) => void;
}) => {
  const form = useForm<EditActionsSchema>({
    resolver: zodResolver(schema),
    values: { actions },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "actions",
    control: form.control,
  });

  useAutoSubmitForm({
    form,
    onSubmit: (values) => onSave({ actions: values.actions }),
  });

  return {
    form,
    fields,
    append,
    remove,
    update,
  };
};

export type EditActionsForm = UseFormReturn<EditActionsSchema>;
