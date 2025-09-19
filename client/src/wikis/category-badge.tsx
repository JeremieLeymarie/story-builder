import { getIsColorDark } from "@/lib/colors";
import { cn } from "@/lib/style";

export const CategoryBadge = ({
  color = "#f0f0f0",
  name = "Other",
  className,
}: {
  name?: string;
  color?: string;
  className?: string;
}) => {
  const isColorDark = getIsColorDark(color);

  return (
    <div
      className={cn(
        "w-max rounded-lg px-3 py-0.5 select-none",
        isColorDark ? "text-white" : "text-black",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  );
};
