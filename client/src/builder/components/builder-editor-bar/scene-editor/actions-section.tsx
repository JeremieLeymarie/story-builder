import { useFieldArray, UseFormReturn } from "react-hook-form";
import { SceneSchema } from "./schema";
import { Button, FormDescription } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { ActionItem } from "./action-item";

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
            onClick={() => append({ type: "simple", text: "" })}
          >
            <PlusIcon />
          </Button>
        </div>
        <hr />
      </div>

      <FormDescription className="my-2">
        Buttons that allow the player to move in your story
      </FormDescription>
      <div>
        {fields.map((field, index) => (
          <ActionItem
            key={field.id}
            field={field}
            form={form}
            index={index}
            removeAction={remove}
          />
        ))}
      </div>
    </div>
  );
};
