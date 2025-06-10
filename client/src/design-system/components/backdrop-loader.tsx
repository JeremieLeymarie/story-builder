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
        "bg-opacity-90 absolute z-50 flex h-full w-full flex-col items-center justify-center gap-6 bg-white",
        className,
      )}
    >
      {text && <p className="animate-pulse">{text}</p>}
      <SimpleLoader />
    </div>
  );
};
