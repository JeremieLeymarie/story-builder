import { cn } from "@/lib/style";
import { cva, VariantProps } from "class-variance-authority";
import { LoaderIcon } from "lucide-react";

const loaderVariants = cva("size-12 animate-spin", {
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
  return <LoaderIcon className={cn(loaderVariants({ variant }), className)} />;
};
