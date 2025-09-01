import { JSX, RefObject } from "react";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import { cn } from "@/lib/style";

type Props = {
  placeholder: string;
  className?: string;
  placeholderClassName?: string;
  ref: RefObject<HTMLDivElement | null>;
};

export const ContentEditable = ({
  placeholder,
  className,
  placeholderClassName,
  ref,
}: Props): JSX.Element => {
  return (
    <LexicalContentEditable
      ref={ref}
      className={cn(
        "relative block min-h-full overflow-auto py-4 focus:outline-none",
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
