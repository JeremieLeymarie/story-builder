import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scene } from "@/lib/storage/domain";
import z from "zod";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";
import { actionSchema } from "@/lib/action-schema";

const schema = z.object({ actions: z.array(actionSchema) });

type EditActionsSchemaInput = z.input<typeof schema>;
export type EditActionsSchema = z.output<typeof schema>;

export const useEditActionsForm = ({
  actions,
  onSave,
}: {
  actions: Scene["actions"];
  onSave: (payload: { actions: Scene["actions"] }) => void;
}) => {
  const form = useForm<EditActionsSchemaInput, unknown, EditActionsSchema>({
    resolver: zodResolver(schema),
    values: { actions },
  });

  const { fields, append, remove, update, move } = useFieldArray({
    name: "actions",
    control: form.control,
  });

  const { isSaving } = useAutoSubmitForm({
    form,
    onSubmit: (values) => onSave({ actions: values.actions }),
  });

  return { form, fields, append, remove, update, move, isSaving };
};

export type EditActionsForm = UseFormReturn<EditActionsSchema>;
