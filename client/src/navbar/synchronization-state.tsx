import { Button } from "@/design-system/primitives";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { SynchronizationState } from "@/navbar/hooks/use-synchronization";
import { cn } from "@/lib/style";
import { RefreshCcwIcon } from "lucide-react";
import { useTimeFromLastSync } from "./hooks/use-time-from-last-sync";

type State = "loading" | "success" | "failure";
const SynchronizeButton = ({
  synchronize,
  state,
}: {
  synchronize: () => void;
  state: State;
}) => {
  const label = {
    loading: "Synchronizing",
    success: "Synchronized",
    failure: "Synchronization failure",
  }[state];

  const timeFromLastSync = useTimeFromLastSync();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex gap-2 text-xs",
        state === "success" && "text-positive hover:text-positive",
        state === "failure" && "text-destructive hover:text-destructive",
        state === "loading" && "text-muted-foreground hover:text-muted",
      )}
      disabled={state === "loading"}
      onClick={synchronize}
    >
      <div>
        {label}
        {timeFromLastSync && <p className="text-2xs">{timeFromLastSync}</p>}
      </div>
      <RefreshCcwIcon
        size="18px"
        className={cn(
          state === "success" && "stroke-positive",
          state === "failure" && "stroke-destructive",
          state === "loading" && "stroke-text-muted animate-spin",
        )}
      />
    </Button>
  );
};

export const SynchronizationStateDisplay = ({
  syncState,
  synchronize,
}: {
  syncState: SynchronizationState;
  synchronize: () => void;
}) => {
  const state = syncState.isLoading
    ? "loading"
    : syncState.success
      ? "success"
      : "failure";

  return (
    <div className="flex items-center justify-center gap-4">
      {syncState.success === false ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <SynchronizeButton state={state} synchronize={synchronize} />
            </TooltipTrigger>
            <TooltipContent className="text-xs text-muted-foreground">
              Failure: {syncState.cause}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <SynchronizeButton state={state} synchronize={synchronize} />
      )}
    </div>
  );
};
