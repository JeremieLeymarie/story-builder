import { cn } from "@/lib/style";
import { cx } from "class-variance-authority";
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
      className={cx("z-50 rounded border bg-white/95 p-4 shadow-sm", className)}
    >
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

<p className="text-primary text-2xl font-semibold">TOOLS</p>;
