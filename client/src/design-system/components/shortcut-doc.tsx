export const ButtonShortCutDoc = ({ doc }: { doc: string }) => {
  return (
    <div
      aria-keyshortcuts={doc}
      className="text-muted-foreground border-secondary bg-secondary/50 absolute right-2 rounded-sm px-2 py-1 text-xs"
    >
      {doc}
    </div>
  );
};
