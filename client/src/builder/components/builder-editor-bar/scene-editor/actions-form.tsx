import { Button, FormDescription } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { ActionItem } from "./action-item";
import { useEditActionsForm } from "@/builder/hooks/use-edit-actions-form";
import { Action } from "@/lib/storage/domain";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";

export const ActionsForm = ({
  sceneKey,
  actions,
}: {
  sceneKey: string;
  actions: Action[];
}) => {
  const { updateScene } = useBuilderActions();
  const { form, append, fields, remove, update } = useEditActionsForm({
    actions,
    onSave: (payload) => updateScene({ key: sceneKey, ...payload }),
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
            onClick={() => append({ showCondition: "always", text: "" })}
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
            actionField={field}
            form={form}
            index={index}
            removeAction={remove}
            updateAction={update}
          />
        ))}
      </div>
    </div>
  );
};
