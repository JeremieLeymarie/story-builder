import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { useCallback, useEffect, useState } from "react";
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
  const { debounceAfter = 300 } = options ?? {};
  const [isSaving, setIsSaving] = useState(false);

  const wrappedSubmit = useCallback(
    async (data: TFormSchema) => {
      setIsSaving(true);
      const minDisplay = new Promise((r) => setTimeout(r, 500));
      try {
        await Promise.all([onSubmit(data), minDisplay]);
      } finally {
        setIsSaving(false);
      }
    },
    [onSubmit],
  );

  const debouncer = useDebouncer(
    () => {
      form.handleSubmit(wrappedSubmit, (invalid) => console.error(invalid))();
    },
    { wait: debounceAfter },
    () => {}, // Never re-render when internal debouncer state changes
  );

  useEffect(() => {
    const callback = form.subscribe({
      formState: { values: true },
      callback: () => {
        if (Object.keys(form.formState.dirtyFields).length > 0)
          return debouncer.maybeExecute();
      },
    });
    return () => callback();
  }, [debouncer, form]);

  return { maybeSubmit: debouncer.maybeExecute, isSaving };
};
