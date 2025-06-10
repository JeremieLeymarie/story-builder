import { cn } from "@/lib/style";
import { SimpleLoader } from "./simple-loader";

export const BackdropLoader = ({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute z-50 flex h-full w-full flex-col items-center justify-center gap-6 bg-white/90",
        className,
      )}
    >
      {text && <p className="animate-pulse">{text}</p>}
      <SimpleLoader />
    </div>
  );
};
