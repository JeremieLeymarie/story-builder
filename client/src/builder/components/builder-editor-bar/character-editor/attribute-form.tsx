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
import { CharacterAttribute } from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";

type AttributeFormProps = {
  closeEditor: () => void;
  attribute: CharacterAttribute | null;
};

const attributeSchema = z.object({
  type: z.literal("numeric"),
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  visibility: z.union([z.literal("visible"), z.literal("invisible")]),
  initialValue: z.int(),
});

const useAttributeForm = ({ closeEditor, attribute }: AttributeFormProps) => {
  const defaultValues = attribute ?? {
    type: "numeric",
    initialValue: 0,
    visibility: "visible",
    name: "",
    description: "",
  };
  const isEdition = !!attribute?.key;
  const form = useForm({
    resolver: zodResolver(attributeSchema),
    values: defaultValues,
  });
  const { addAttribute, updateAttribute } = useCharacterAttributeActions();

  const handleSubmit = form.handleSubmit(async (payload) => {
    if (isEdition) await updateAttribute({ ...payload, key: attribute.key });
    else await addAttribute(payload);
    closeEditor();
  });

  return { form, handleSubmit };
};

export const AttributeForm = ({
  closeEditor,
  attribute,
}: AttributeFormProps) => {
  const { form, handleSubmit } = useAttributeForm({ closeEditor, attribute });
  const { removeAttribute } = useCharacterAttributeActions();
  const isEdition = !!attribute?.key;

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
        <div className="flex justify-between">
          {isEdition && (
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                removeAttribute(attribute.key);
                closeEditor();
              }}
            >
              Remove
            </Button>
          )}
          <Button>Save</Button>
        </div>
      </form>
    </Form>
  );
};
