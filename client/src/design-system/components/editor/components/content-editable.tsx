import { JSX, RefObject } from "react";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import { cn } from "@/lib/style";

type Props = {
  placeholder: string;
  className?: string;
  textColor?: string;
  placeholderClassName?: string;
  ref: RefObject<HTMLDivElement | null>;
};

export const ContentEditable = ({
  placeholder,
  className,
  textColor,
  placeholderClassName,
  ref,
}: Props): JSX.Element => {
  return (
    <LexicalContentEditable
      ref={ref}
      className={cn(
        "relative block min-h-full py-4 focus:outline-none",
        className,
      )}
      style={{ color: textColor }}
      aria-placeholder={placeholder}
      placeholder={
        <div
          className={cn(
            "text-muted-foreground pointer-events-none absolute top-0 left-0 overflow-hidden px-4 py-4 text-ellipsis select-none",
            placeholderClassName,
          )}
        >
          {placeholder}
        </div>
      }
    />
  );
};
