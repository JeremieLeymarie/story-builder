import { useEffect, useState } from "react";
import { Spinner, SpinnerCheck } from "../primitives";

type SaveState = "idle" | "saving" | "done";

const useSaveState = (isSaving: boolean): SaveState => {
  const [prevIsSaving, setPrevIsSaving] = useState(isSaving);
  const [state, setState] = useState<SaveState>("idle");

  // Derive state from prop change during render (React recommended pattern)
  if (isSaving !== prevIsSaving) {
    setPrevIsSaving(isSaving);
    if (isSaving) setState("saving");
    else if (state === "saving") setState("done");
  }

  // Timer to hide "done" after 1.5s (external system = timer)
  useEffect(() => {
    if (state !== "done") return;
    const timer = setTimeout(() => setState("idle"), 1500);
    return () => clearTimeout(timer);
  }, [state]);

  return state;
};

export const SavingIndicator = ({ isSaving }: { isSaving: boolean }) => {
  const state = useSaveState(isSaving);

  if (state === "saving") {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Spinner className="text-primary" />
        Saving...
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-500">
        <SpinnerCheck />
        Saved
      </div>
    );
  }

  return null;
};
