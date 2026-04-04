import { SimpleLoader } from "@/design-system/components/simple-loader";

export const SavingIndicator = ({ isSaving }: { isSaving: boolean }) => {
  if (!isSaving) return null;

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <SimpleLoader className="size-4" />
      Saving...
    </div>
  );
};
