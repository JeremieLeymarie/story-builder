export const isAnyInputFocused = () => {
  const isInputFocused = document.activeElement?.tagName === "INPUT";
  const isTextAreaFocused = document.activeElement?.tagName === "TEXTAREA";
  const isContentEditableFocused =
    document.activeElement?.getAttribute("contenteditable") === "true";
  // ShadCN sets pointer-events: 'none' on the body when a dialog is open
  const isAnyModalOpen = document.body.style.pointerEvents === "none";

  return (
    isInputFocused ||
    isTextAreaFocused ||
    isContentEditableFocused ||
    isAnyModalOpen
  );
};
