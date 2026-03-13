import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { FormError } from "@/design-system/components/form-error";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { Action, Scene } from "@/lib/storage/domain";
import {
  useEditRandomEventForm,
  RandomEventSchema,
  parseProbability,
} from "@/builder/hooks/use-random-event-form";
import { useProbabilityMask } from "@/builder/hooks/use-probability-mask";
import { ControllerRenderProps } from "react-hook-form";

const ProbabilityInput = ({
  field,
  fieldState,
  targetSceneKey,
  hasRootError,
  onProbabilityBlur,
}: {
  field: ControllerRenderProps<RandomEventSchema, string>;
  fieldState: { invalid: boolean };
  targetSceneKey: string;
  hasRootError: boolean;
  onProbabilityBlur: (targetSceneKey: string, value: string) => void;
}) => {
  const inputRef = useProbabilityMask();

  return (
    <Input
      className="max-w-15 min-w-15"
      aria-invalid={fieldState.invalid || hasRootError}
      value={field.value}
      onInput={(e) => {
        field.onChange(e.currentTarget.value);
      }}
      onBlur={() => {
        onProbabilityBlur(targetSceneKey, field.value);
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
  const { updateTargetProbability } = useBuilderActions();

  const { form, handleProbabilityBlur } = useEditRandomEventForm({
    defaultValues: Object.fromEntries(
      action.targets.map((target) => [
        target.sceneKey,
        `${target.probability}%`,
      ]),
    ),
    sourceScene,
    action,
    updateTargetProbability,
  });

  const values = form.watch();
  const total = Object.values(values).reduce(
    (sum, v) => sum + parseProbability(v),
    0,
  );
  const hasRootError = total !== 100;

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-112.5 w-full space-y-4">
          <div className="h-75">
            {action.targets.map((target) => {
              const scene = scenesByKey[target.sceneKey]!;
              return (
                <FormField
                  key={scene.key}
                  control={form.control}
                  name={scene.key}
                  render={({ field, fieldState }) => (
                    <FormItem className="flex justify-between">
                      <FormLabel className="mt-3 mb-3 truncate">
                        {scene.title}
                      </FormLabel>
                      <ProbabilityInput
                        field={field}
                        fieldState={fieldState}
                        targetSceneKey={target.sceneKey}
                        hasRootError={hasRootError}
                        onProbabilityBlur={handleProbabilityBlur}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
          {hasRootError && (
            <FormError>
              Le total des probabilités doit être égal à 100% (actuellement{" "}
              {total}%)
            </FormError>
          )}
        </div>
      </form>
    </Form>
  );
};
