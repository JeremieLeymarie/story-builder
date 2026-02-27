import { useCharacterAttributeActions } from "@/builder/hooks/use-character-attribute-actions";
import { Button, Form, Input, Textarea } from "@/design-system/primitives";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/design-system/primitives/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/design-system/primitives/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, PencilIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";

const attributeSchema = z.object({
  type: z.literal("numeric"),
  name: z.string(),
  description: z.string().optional(),
  isEditableByPlayer: z.boolean(),
  visibility: z.union([z.literal("visible"), z.literal("invisible")]),
  initialValue: z.int(),
});

const useAttributeForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const form = useForm({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      type: "numeric",
      initialValue: 0,
      visibility: "visible",
      isEditableByPlayer: false,
    },
  });
  const { addAttribute } = useCharacterAttributeActions();

  const handleSubmit = form.handleSubmit(async (payload) => {
    await addAttribute(payload);
    onSubmit();
  });

  return { form, handleSubmit };
};

export const AttributeForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { form, handleSubmit } = useAttributeForm({ onSubmit });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />{" "}
        <Controller
          control={form.control}
          name="initialValue"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Initial value</FieldLabel>
              <FieldDescription>
                The value at the start of the story
              </FieldDescription>
              <Input
                value={field.value}
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value));
                }}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="visibility"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend variant="label" className="flex items-center gap-2">
                <EyeIcon size={14} />
                Visibility
              </FieldLegend>
              <FieldDescription>
                Is this attribute visible by the player?
              </FieldDescription>

              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                className="flex"
              >
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value={"visible" as const}
                    id="visible"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor="visible" className="font-normal">
                    Visible
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value={"invisible" as const}
                    id="invisible"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor="invisible" className="font-normal">
                    Not visible
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>
          )}
        />
        <Controller
          control={form.control}
          name="isEditableByPlayer"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend variant="label" className="flex items-center gap-2">
                <PencilIcon size={14} />
                Edition
              </FieldLegend>
              <FieldDescription>
                Is this attribute editable by the player?
              </FieldDescription>

              <RadioGroup
                name={field.name}
                value={field.value ? "yes" : "no"}
                onValueChange={(v) => field.onChange(v === "yes")}
                className="flex"
              >
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value={"yes" as const}
                    id="yes"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor="yes" className="font-normal">
                    Yes
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem
                    value={"no" as const}
                    id="no"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor="no" className="font-normal">
                    No
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>
          )}
        />
        <Button>Save</Button>
      </form>
    </Form>
  );
};
