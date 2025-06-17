import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { useReactFlow } from "@xyflow/react";
import { MinusIcon, NetworkIcon, PlusIcon, ScanIcon } from "lucide-react";
import { useAutoLayout } from "../hooks/use-auto-layout";
import { Button } from "@/design-system/primitives";
import { useBuilderMessageStore } from "../hooks/use-builder-message-store";

const AutoLayout = () => {
  const { organizeNodes, revertChanges } = useAutoLayout();
  const { setOpen } = useBuilderMessageStore();

  const cancelChanges = () => {
    revertChanges();
    setOpen({ open: false, content: null });
  };

  const keepChanges = () => {
    setOpen({ open: false, content: null });
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          className="hover:bg-muted cursor-pointer rounded p-1"
          onClick={() => {
            organizeNodes();
            setOpen({
              open: true,
              content: (
                <div className="flex items-center gap-2">
                  Your layout has changed, do you confirm the changes?
                  <Button size="sm" variant="secondary" onClick={cancelChanges}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={keepChanges}>
                    Keep
                  </Button>
                </div>
              ),
              onCancel: cancelChanges,
            });
          }}
        >
          <NetworkIcon size="16px" />
        </TooltipTrigger>
        <TooltipContent>Automatically re-organize the layout</TooltipContent>
      </Tooltip>
    </>
  );
};

export const ActionsBar = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="relative z-50 flex h-max w-max gap-1 rounded border bg-white/75 p-1 shadow">
      <Tooltip>
        <TooltipTrigger
          className="hover:bg-muted cursor-pointer rounded p-1"
          onClick={() => zoomIn()}
        >
          <PlusIcon size="16px" />
        </TooltipTrigger>
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          className="hover:bg-muted cursor-pointer rounded p-1"
          onClick={() => zoomOut()}
        >
          <MinusIcon size="16px" />
        </TooltipTrigger>
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          className="hover:bg-muted cursor-pointer rounded p-1"
          onClick={() => fitView()}
        >
          <ScanIcon size="16px" />
        </TooltipTrigger>
        <TooltipContent>Resize view to fit elements</TooltipContent>
      </Tooltip>
      <AutoLayout />
    </div>
  );
};
