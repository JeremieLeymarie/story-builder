import { cx } from "class-variance-authority";
import { ReactNode } from "react";

export const Bar = ({
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
