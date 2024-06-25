import { PropsWithChildren } from "react";
import { FormDescription } from "../primitives";

export const FormError = ({ children }: PropsWithChildren) => {
  return (
    <FormDescription className="text-sm font-medium text-destructive">
      {children}
    </FormDescription>
  );
};
