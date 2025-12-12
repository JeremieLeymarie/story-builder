import { StoryThemeConfig } from "@/lib/storage/domain";
import { cn } from "@/lib/style";
import { cva } from "class-variance-authority";

const titleVariants = cva("", {
  variants: {
    size: {
      huge: "text-4xl lg:text-5xl",
      large: "text-3xl lg:text-4xl",
      medium: "text-2xl lg:text-3xl",
      small: "text-xl lg:text-2xl",
    },
  },
});

export const SceneTitle = ({
  color,
  hidden,
  size,
  title,
}: StoryThemeConfig["title"] & { title: string }) => {
  return hidden ? null : (
    <h1
      className={cn(
        titleVariants({ size }),
        "scroll-m-20 font-bold tracking-tight transition-all",
      )}
      style={{ color }}
    >
      {title}
    </h1>
  );
};
