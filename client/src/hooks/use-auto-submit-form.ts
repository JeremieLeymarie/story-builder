import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

// TODO: test this
export const useAutoSubmitForm = <TFormSchema extends FieldValues>({
  form,
  onSubmit,
  options,
}: {
  form: UseFormReturn<TFormSchema>;
  onSubmit: (data: TFormSchema) => void;
  options?: { debounceAfter?: number };
}) => {
  const { debounceAfter = 500 } = options ?? {};

  const debouncer = useDebouncer(
    () => {
      form.handleSubmit(onSubmit)();
    },
    { wait: debounceAfter },
    () => {}, // Never re-render when internal debouncer state changes
  );

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: debouncer.maybeExecute,
    });
    return () => callback();
  }, [debouncer, form]);
};
