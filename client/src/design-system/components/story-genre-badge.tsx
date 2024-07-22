import { cn } from "@/lib/style";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        adventure:
          "border-transparent bg-[#accafa] text-gray-800 hover:opacity-80",
        children:
          "border-transparent bg-[#f7c8ec] text-gray-800 hover:opacity-80",
        detective:
          "border-transparent bg-[#e3ffae] text-gray-800 hover:opacity-80",
        dystopia:
          "border-transparent bg-[#1c324b] text-gray-100 hover:opacity-80",
        fantasy:
          "border-transparent bg-[#0f3e17] text-gray-100 hover:opacity-80",
        historical:
          "border-transparent bg-[#572a12] text-gray-100 hover:opacity-80",
        horror:
          "border-transparent bg-[#175125] text-gray-100 hover:opacity-80",
        humor: "border-transparent bg-[#dcb5c0] text-gray-800 hover:opacity-80",
        mystery:
          "border-transparent bg-[#3d32e1] text-gray-100 hover:opacity-80",
        romance:
          "border-transparent bg-[#faa370] text-gray-800 hover:opacity-80",
        "science-fiction":
          "border-transparent bg-[#75a1f8] text-gray-800 hover:opacity-80",
        thriller:
          "border-transparent bg-[#4c1b7c] text-gray-100 hover:opacity-80",
        suspense:
          "border-transparent bg-[#0b0114] text-gray-100 hover:opacity-80",
        western:
          "border-transparent bg-[#cc9e1d] text-gray-800 hover:opacity-80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export const StoryGenreBadge = ({
  className,
  variant,
  ...props
}: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant}
    </div>
  );
};
