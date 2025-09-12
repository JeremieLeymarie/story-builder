import { getIsColorDark } from "@/lib/colors";
import { cn } from "@/lib/style";

export const CategoryBadge = ({
  color,
  children,
}: {
  children: string;
  color: string;
}) => {
  const isColorDark = getIsColorDark(color);

  return (
    <div
      className={cn(
        isColorDark ? "text-white" : "text-black",
        "rounded-lg px-3 py-0.5",
      )}
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
};
