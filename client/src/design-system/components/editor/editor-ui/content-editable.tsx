import { JSX } from "react";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import { cn } from "@/lib/style";

type Props = {
  placeholder: string;
  className?: string;
  placeholderClassName?: string;
};

export const ContentEditable = ({
  placeholder,
  className,
  placeholderClassName,
}: Props): JSX.Element => {
  return (
    <LexicalContentEditable
      className={cn(
        "relative block min-h-full overflow-auto px-4 py-4 focus:outline-none",
        className,
      )}
      aria-placeholder={placeholder}
      placeholder={
        <div
          className={cn(
            "text-muted-foreground pointer-events-none absolute top-0 left-0 overflow-hidden px-4 py-[18px] text-ellipsis select-none",
            placeholderClassName,
          )}
        >
          {placeholder}
        </div>
      }
    />
  );
};
