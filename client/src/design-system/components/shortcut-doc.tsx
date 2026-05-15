export const ButtonShortCutDoc = ({ doc }: { doc: string }) => {
  return (
    <div
      aria-keyshortcuts={doc}
      className="border-secondary bg-secondary/50 text-muted-foreground absolute right-2 rounded-sm px-2 py-1 text-xs"
    >
      {doc}
    </div>
  );
};
