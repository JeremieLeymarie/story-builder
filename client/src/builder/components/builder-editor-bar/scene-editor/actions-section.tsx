import { useFieldArray, UseFormReturn } from "react-hook-form";
import { SceneSchema } from "./schema";
import {
  Button,
  FormDescription,
  FormItem,
  Input,
} from "@/design-system/primitives";
import { PlusIcon, TrashIcon } from "lucide-react";
import { FormError } from "@/design-system/components";

export const ActionsSection = ({
  form,
}: {
  form: UseFormReturn<SceneSchema>;
}) => {
  const { fields, append, remove } = useFieldArray({
    name: "actions",
    control: form.control,
  });

  return (
    <div className="w-full space-y-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <p className="text-md font-bold">Actions</p>
          <Button
            variant="ghost"
            type="button"
            size="icon"
            onClick={() => append({ type: "simple", targets: [], text: "" })}
          >
            <PlusIcon size="16px" />
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
                size="icon"
                type="button"
                onClick={() => remove(index)}
              >
                <TrashIcon size="16px" />
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
    </div>
  );
};
