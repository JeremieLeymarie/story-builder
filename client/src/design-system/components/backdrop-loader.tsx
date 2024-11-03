import { cn } from "@/lib/style";

export const Loader = ({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute z-50 flex h-full w-full flex-col items-center justify-center gap-6 bg-white bg-opacity-90",
        className,
      )}
    >
      {text && <p className="animate-pulse">{text}</p>}
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
        className="animate-spin text-primary"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};
