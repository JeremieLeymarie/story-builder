import { Form, Input } from "@/design-system/primitives";
import { Action, Scene } from "@/lib/storage/domain";
import {
  RandomEventSchemaInput,
  useEditRandomEventForm,
} from "@/builder/hooks/use-random-event-form";
import { useProbabilityMask } from "@/builder/hooks/use-probability-mask";
import { Controller, ControllerRenderProps } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/design-system/primitives/field";
import { FormError } from "@/design-system/components";

const ProbabilityInput = ({
  field,
  isInvalid,
}: {
  field: ControllerRenderProps<RandomEventSchemaInput, string>;
  isInvalid: boolean;
}) => {
  const inputRef = useProbabilityMask();

  return (
    <Input
      className="max-w-15 min-w-15"
      aria-invalid={isInvalid}
      value={field.value}
      onInput={(e) => {
        field.onChange(e.currentTarget.value);
      }}
      ref={(node) => {
        inputRef(node);
        field.ref(node);
      }}
    />
  );
};

export const RandomEventsForm = ({
  scenesByKey,
  action,
  sourceScene,
}: {
  scenesByKey: Record<string, Scene>;
  action: Action;
  sourceScene: Scene;
}) => {
  const { form, rootError } = useEditRandomEventForm({
    defaultValues: Object.fromEntries(
      action.targets.map((target) => [
        target.sceneKey,
        `${target.probability}%`,
      ]),
    ),
    sourceScene,
    action,
  });

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-full space-y-4">
          <div className="flex flex-col gap-2">
            {action.targets.map((target) => {
              const scene = scenesByKey[target.sceneKey]!;
              return (
                <Controller
                  key={scene.key}
                  control={form.control}
                  name={scene.key}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel
                          className="flex-1 truncate"
                          htmlFor={field.name}
                        >
                          {scene.title}
                        </FieldLabel>
                        <ProbabilityInput
                          field={field}
                          isInvalid={fieldState.invalid || !!rootError}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              );
            })}
          </div>
          {rootError && <FormError>{rootError}</FormError>}
        </div>
      </form>
    </Form>
  );
};
