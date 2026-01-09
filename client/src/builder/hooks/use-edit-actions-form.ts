import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Action, Scene } from "@/lib/storage/domain";
import { match } from "ts-pattern";
import z from "zod";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";

const actionBase = z.object({
  text: z.string({ message: "Text is required" }),
  targets: z.array(z.object({ sceneKey: z.nanoid(), probability: z.number() })),
});

const actionSchema = z.discriminatedUnion("showCondition", [
  actionBase.extend({ showCondition: z.literal("always") }),
  actionBase.extend({
    showCondition: z.literal("when-user-did-visit"),
    targetSceneKey: z.nanoid(),
  }),
  actionBase.extend({
    showCondition: z.literal("when-user-did-not-visit"),
    targetSceneKey: z.nanoid(),
  }),
]);

export type ActionSchema = z.infer<typeof actionSchema>;

const schema = z.object({
  actions: z.array(actionSchema),
});

export type EditActionsSchema = z.infer<typeof schema>;

const adaptDomainAction = (action: Action) => {
  return match<Action, ActionSchema>(action)
    .with({ type: "conditional" }, (a) => ({
      showCondition:
        a.condition.type === "user-did-visit"
          ? "when-user-did-visit"
          : "when-user-did-not-visit",
      text: a.text,
      targets: a.targets,
      targetSceneKey: a.condition.sceneKey,
    }))
    .with({ type: "simple" }, (a) => ({
      showCondition: "always",
      text: a.text,
      targets: a.targets,
    }))
    .exhaustive();
};

const adaptFormAction = (formAction: ActionSchema) => {
  return match<ActionSchema, Action>(formAction)
    .with({ showCondition: "always" }, (a) => ({
      type: "simple",
      text: a.text,
      targets: a.targets,
    }))
    .with({ showCondition: "when-user-did-visit" }, (a) => ({
      type: "conditional",
      text: a.text,
      targets: a.targets,
      condition: { type: "user-did-visit", sceneKey: a.targetSceneKey },
    }))
    .with({ showCondition: "when-user-did-not-visit" }, (a) => ({
      type: "conditional",
      text: a.text,
      targets: a.targets,
      condition: { type: "user-did-not-visit", sceneKey: a.targetSceneKey },
    }))
    .exhaustive();
};

export const useEditActionsForm = ({
  actions,
  onSave,
}: {
  actions: Scene["actions"];
  onSave: (payload: { actions: Scene["actions"] }) => void;
}) => {
  const form = useForm<EditActionsSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      actions: actions.map(adaptDomainAction),
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "actions",
    control: form.control,
  });

  useAutoSubmitForm({
    form,
    onSubmit: (values) =>
      onSave({
        actions: values.actions.map(adaptFormAction),
      }),
  });

  return { form, fields, append, remove, update };
};

export type EditActionsForm = UseFormReturn<EditActionsSchema>;
