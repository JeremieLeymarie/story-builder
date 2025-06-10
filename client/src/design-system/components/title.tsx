import { cn } from "@/lib/style";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const titleVariants = cva("w-max break-words leading-none tracking-tight", {
  variants: {
    variant: {
      primary:
        "rounded-sm bg-gray-50/75 p-2 text-3xl font-semibold max-md:text-xl",
      secondary: "mb-6 mt-2 bg-primary px-3 py-1 text-2xl font-semibold",
      article: "text-4xl font-semibold max-md:text-2xl text-primary",
      section: "max-md:text-md bg-primary px-2 text-lg font-bold uppercase",
      "sub-section":
        "max-md:text-md text-primary text-lg underline underline-offset-8 font-semibold",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type TitleProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof titleVariants>;

export const Title = ({
  className,
  variant,
  children,
  ...props
}: TitleProps) => {
  return (
    <p className={cn(titleVariants({ variant }), className)} {...props}>
      {children}
    </p>
  );
};
