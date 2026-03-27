import { cn } from "@/lib/style";

const getProgressStyle = (percentage: number) => {
  if (percentage === 0) return { bg: "bg-muted", color: "var(--color-muted-foreground)" };
  if (percentage < 34) return { bg: "bg-red-500", color: "#fff" };
  if (percentage < 67) return { bg: "bg-primary", color: "#1f2937" };
  return { bg: "bg-green-500", color: "#fff" };
};

export const ProgressBadge = ({
  percentage,
  className,
}: {
  percentage: number;
  className?: string;
}) => {
  const { bg, color } = getProgressStyle(percentage);

  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-xs font-semibold select-none",
        bg,
        className,
      )}
      style={{ color }}
    >
      {percentage}%
    </span>
  );
};
