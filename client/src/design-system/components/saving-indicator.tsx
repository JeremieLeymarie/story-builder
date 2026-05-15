import { useEffect, useState } from "react";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";

type SaveState = "idle" | "saving" | "done";

const STABILITY_DELAY_MS = 600;
const DONE_DISPLAY_MS = 1500;

const useSaveState = (isSaving: boolean): SaveState => {
  const [prevIsSaving, setPrevIsSaving] = useState(isSaving);
  const [state, setState] = useState<SaveState>("idle");

  if (isSaving !== prevIsSaving) {
    setPrevIsSaving(isSaving);
    if (isSaving) setState("saving");
  }

  // Wait for stability before switching to "done" (avoid flicker during rapid saves)
  useEffect(() => {
    if (isSaving || state !== "saving") return;
    const stabilityTimer = setTimeout(
      () => setState("done"),
      STABILITY_DELAY_MS,
    );
    return () => clearTimeout(stabilityTimer);
  }, [isSaving, state]);

  // Hide "done" after DONE_DISPLAY_MS
  useEffect(() => {
    if (state !== "done") return;
    const hideTimer = setTimeout(() => setState("idle"), DONE_DISPLAY_MS);
    return () => clearTimeout(hideTimer);
  }, [state]);

  return state;
};

export const SavingIndicator = ({ isSaving }: { isSaving: boolean }) => {
  const state = useSaveState(isSaving);

  if (state === "saving") {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <LoaderCircleIcon className="text-primary size-4 animate-spin" />
        Saving...
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-500">
        <CheckIcon className="size-4" />
        Saved
      </div>
    );
  }

  return null;
};
