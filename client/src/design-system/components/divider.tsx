import { cn } from "@/lib/style";
import { HTMLAttributes } from "react";

export const Divider = ({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) => {
  return (
    <hr
      className={cn("w-full border-t-4 border-t-primary", className)}
      {...props}
    />
  );
};
