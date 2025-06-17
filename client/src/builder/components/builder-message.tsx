import { useEffect } from "react";
import { useBuilderMessageStore } from "../hooks/use-builder-message-store";

export const BuilderMessage = () => {
  const { open, content, onCancel } = useBuilderMessageStore();

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel?.();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeypress);

    return () => window.removeEventListener("keydown", handleKeypress);
  });

  return open ? (
    <div className="border-primary absolute bottom-4 left-1/2 z-50 max-w-[80vw] -translate-x-1/2 transform rounded-lg border bg-white/75 px-4 py-3 shadow">
      {content}
    </div>
  ) : null;
};
