import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/style";

const progressBadgeVariants = cva(
  "rounded-full px-1.5 py-0.5 text-xs font-semibold select-none",
  {
    variants: {
      level: {
        0: "bg-muted text-muted-foreground",
        10: "bg-primary/10 text-foreground",
        20: "bg-primary/20 text-foreground",
        30: "bg-primary/30 text-foreground",
        40: "bg-primary/40 text-foreground",
        50: "bg-primary/50 text-foreground",
        60: "bg-primary/60 text-foreground",
        70: "bg-primary/70 text-primary-foreground",
        80: "bg-primary/80 text-primary-foreground",
        90: "bg-primary/90 text-primary-foreground",
        100: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      level: 0,
    },
  },
);

const getLevel = (percentage: number) => {
  if (percentage === 0) return 0 as const;
  if (percentage <= 10) return 10 as const;
  if (percentage <= 20) return 20 as const;
  if (percentage <= 30) return 30 as const;
  if (percentage <= 40) return 40 as const;
  if (percentage <= 50) return 50 as const;
  if (percentage <= 60) return 60 as const;
  if (percentage <= 70) return 70 as const;
  if (percentage <= 80) return 80 as const;
  if (percentage <= 90) return 90 as const;
  return 100 as const;
};

function ProgressBadge({
  className,
  percentage,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  percentage: number;
}) {
  return (
    <span
      data-slot="progress-badge"
      className={cn(
        progressBadgeVariants({ level: getLevel(percentage) }),
        className,
      )}
      {...props}
    >
      {percentage}%
    </span>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { ProgressBadge, progressBadgeVariants };
