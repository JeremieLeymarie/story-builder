import { PropsWithChildren } from "react";
import { FormDescription } from "../primitives";
import { cn } from "@/lib/style";

export const FormError = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <FormDescription
      className={cn("text-destructive text-sm font-medium", className)}
    >
      {children}
    </FormDescription>
  );
};
