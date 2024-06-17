import { PropsWithChildren } from "react";
import { FormDescription } from "../primitives";

export const FormError = ({ children }: PropsWithChildren) => {
  return (
    <FormDescription className="text-destructive">{children}</FormDescription>
  );
};
