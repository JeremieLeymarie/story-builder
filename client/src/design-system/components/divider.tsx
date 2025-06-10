import { cn } from "@/lib/style";
import { HTMLAttributes } from "react";

export const Divider = ({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) => {
  return (
    <hr
      className={cn(
        "bg-primary text-primary h-1 w-full border-none",
        className,
      )}
      {...props}
    />
  );
};
