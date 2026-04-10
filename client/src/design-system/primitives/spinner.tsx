import { CheckIcon, LoaderIcon } from "lucide-react";
import { cn } from "@/lib/style";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

function SpinnerCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <CheckIcon
      role="status"
      aria-label="Done"
      className={cn("size-4 text-green-500", className)}
      {...props}
    />
  );
}

export { Spinner, SpinnerCheck };
