import { ReactNode } from "@tanstack/react-router";
import { Card, CardDescription, CardHeader, CardTitle } from "../primitives";

export const ErrorMessage = ({ children }: { children?: ReactNode }) => {
  return (
    <Card className="m-8">
      <CardHeader className="text-red-400">
        <CardTitle>Error</CardTitle>
        <CardDescription>
          {children ?? "Something went wrong. Please contact an admin."}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
