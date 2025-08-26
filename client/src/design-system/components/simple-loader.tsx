import { cn } from "@/lib/style";
import { cva, VariantProps } from "class-variance-authority";

const loaderVariants = cva("animate-spin", {
  variants: {
    variant: {
      primary: "text-primary",
      secondary: "text-white",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export const SimpleLoader = ({
  className,
  variant,
}: { className?: string } & VariantProps<typeof loaderVariants>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(loaderVariants({ className, variant }))}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
