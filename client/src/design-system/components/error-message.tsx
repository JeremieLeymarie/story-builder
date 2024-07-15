import { Card, CardDescription, CardHeader, CardTitle } from "../primitives";

type ErrorMessageProps = { text?: string };

export const ErrorMessage = ({ text }: ErrorMessageProps) => {
  return (
    <Card className="p-8">
      <CardHeader className="text-red-400">
        <CardTitle>Error</CardTitle>
        <CardDescription>
          {text ?? "Something went wrong. Please contact an admin."}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
