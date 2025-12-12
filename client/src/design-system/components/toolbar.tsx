import { cn } from "@/lib/style";
import { ReactNode } from "react";

export const Toolbar = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("z-40 rounded border bg-white/95 p-4 shadow-sm", className)}
    >
      {children}
    </div>
  );
};

export const ToolbarHeader = ({
  className,
  ...props
}: { className?: string } & React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <div className={cn("mb-2 flex flex-col space-y-1", className)} {...props} />
  );
};

export const ToolbarTitle = ({
  className,
  ...props
}: { className?: string } & React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn(
        "text-2xl leading-none font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
};

export const ToolbarDescription = ({
  className,
  ...props
}: { className?: string } & React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <p
      className={cn("text-muted-foreground leading-none italic", className)}
      {...props}
    />
  );
};
