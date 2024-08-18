import { cn } from "@/lib/style";
import { HTMLAttributes } from "react";

export const Divider = ({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) => {
  return (
    <hr
      className={cn(
        "h-1 w-full border-none bg-primary text-primary",
        className,
      )}
      {...props}
    />
  );
};
