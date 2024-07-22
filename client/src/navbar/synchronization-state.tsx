import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { SynchronizationState } from "@/hooks/use-synchronization";
import { CircleAlertIcon, RefreshCcwIcon } from "lucide-react";

export const SynchronizationStateDisplay = ({
  syncState,
}: {
  syncState: SynchronizationState;
}) => (
  <div className="flex items-center justify-center gap-4">
    {syncState.isLoading && (
      <div className="flex gap-2 align-middle text-xs text-muted-foreground">
        Synchronizing
        <RefreshCcwIcon
          size="18px"
          className="stroke-text-muted-foreground animate-spin"
        />
      </div>
    )}
    {syncState.success ? (
      <div className="flex gap-2 align-middle text-xs text-muted-foreground">
        Synchronized
        <RefreshCcwIcon size="18px" className="stroke-text-" />
      </div>
    ) : (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex gap-2 align-middle text-xs text-destructive">
              <CircleAlertIcon size="18px" />
              Synchronization failed
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-xs text-muted-foreground">
            {syncState.cause}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);
