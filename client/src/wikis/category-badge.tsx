import { getIsColorDark } from "@/lib/colors";
import { cn } from "@/lib/style";
import { cva, VariantProps } from "class-variance-authority";

const variants = cva("w-max rounded-lg select-none", {
  variants: {
    size: {
      sm: "px-2 py-0.25",
      md: "px-3 py-0.5",
    },
    brightness: {
      light: "text-black",
      dark: "text-white",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const CategoryBadge = ({
  color = "#f0f0f0",
  name = "Other",
  size,
  className,
}: {
  name?: string;
  color?: string;
  className?: string;
  size?: VariantProps<typeof variants>["size"];
}) => {
  const isColorDark = getIsColorDark(color);

  return (
    <div
      className={cn(
        variants({ brightness: isColorDark ? "dark" : "light", size }),
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  );
};
