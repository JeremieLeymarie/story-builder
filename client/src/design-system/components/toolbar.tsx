import { cn } from "@/lib/style";
import { XIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button, buttonVariants } from "../primitives";
import { VariantProps } from "class-variance-authority";

// TODO: add closing capabilities (w/ context directly in DS)
export const Toolbar = ({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <div
      className={cn(
        "ring-border z-40 rounded-xl bg-white/98 p-3 shadow-sm ring-1",
        className,
      )}
      id={id}
    >
      {children}
    </div>
  );
};

export const ToolbarHeader = ({
  className,
  children,
  ...props
}: {
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <div className={cn("mb-2 flex flex-col space-y-1", className)} {...props}>
      {children}
    </div>
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

export const ToolbarClose = (
  props?: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    },
) => {
  return (
    <Button variant="ghost" size="icon-sm" {...props}>
      <XIcon />
    </Button>
  );
};
