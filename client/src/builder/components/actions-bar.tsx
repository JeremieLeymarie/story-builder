import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { useReactFlow } from "@xyflow/react";
import { MinusIcon, NetworkIcon, PlusIcon, ScanIcon } from "lucide-react";
import { useAutoLayout } from "../hooks/use-auto-layout";
import { toast } from "sonner";
import { useState } from "react";

const AutoLayout = () => {
  const { organizeNodes, revertChanges } = useAutoLayout();
  const [enabled, setEnabled] = useState(true);

  const autoOrganizeLayout = async () => {
    setEnabled(false);
    await organizeNodes();

    toast.success("Layout modified", {
      description: "You can undo the automatic changes",
      action: {
        label: "Undo",
        onClick: () => {
          revertChanges();
          setEnabled(true);
        },
        actionButtonStyle: { backgroundColor: "var(--color-primary)" },
      },
      onDismiss: () => setEnabled(true),
      onAutoClose: () => setEnabled(true),
    });
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          disabled={!enabled}
          className="hover:bg-muted cursor-pointer rounded p-1"
          onClick={autoOrganizeLayout}
        >
          <NetworkIcon
            size="16px"
            color={enabled ? undefined : "var(--color-muted-foreground)"}
          />
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
