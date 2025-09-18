import { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../primitives";

export const ErrorMessage = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <Card className="m-8">
      <CardHeader className="text-red-400">
        <CardTitle>Error</CardTitle>
        <CardDescription className={className}>
          {children ?? "Something went wrong. Please contact an admin."}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
