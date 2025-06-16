import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { ReactNode } from "@tanstack/react-router";
import { useReactFlow } from "@xyflow/react";
import { MinusIcon, NetworkIcon, PlusIcon, ScanIcon } from "lucide-react";
import { useOrganizeNodes } from "../hooks/use-order-nodes";

const IconWrapper = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="hover:bg-muted cursor-pointer rounded p-1"
    >
      {children}
    </button>
  );
};

export const ActionsBar = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { organizeNodes } = useOrganizeNodes();

  return (
    <div className="z-50 flex h-max w-max gap-1 rounded border bg-white/75 p-1 shadow">
      <Tooltip>
        <TooltipTrigger>
          <IconWrapper onClick={zoomIn}>
            <PlusIcon size="16px" />
          </IconWrapper>
        </TooltipTrigger>
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <IconWrapper onClick={zoomOut}>
            <MinusIcon size="16px" />
          </IconWrapper>
        </TooltipTrigger>
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <IconWrapper onClick={fitView}>
            <ScanIcon size="16px" />
          </IconWrapper>
        </TooltipTrigger>
        <TooltipContent>Resize view to fit elements</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <IconWrapper onClick={organizeNodes}>
            <NetworkIcon size="16px" />
          </IconWrapper>
        </TooltipTrigger>
        <TooltipContent>Automatically re-organize the layout</TooltipContent>
      </Tooltip>
    </div>
  );
};
