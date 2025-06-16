import { ReactNode } from "@tanstack/react-router";
import { MinusIcon, NetworkIcon, PlusIcon, ScanIcon } from "lucide-react";

const IconWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="hover:bg-muted rounded p-1">{children}</div>;
};

export const ActionsBar = () => {
  return (
    <div className="border-primary absolute bottom-4 left-1/2 flex max-w-[80vw] -translate-x-1/2 -translate-y-1/2 transform gap-1 rounded border bg-white/75 p-1 shadow">
      {/* <Tooltip> */}
      <IconWrapper>
        <PlusIcon size="16px" />
      </IconWrapper>
      {/* </Tooltip> */}
      <IconWrapper>
        <MinusIcon size="16px" />
      </IconWrapper>
      <IconWrapper>
        <ScanIcon size="16px" />
      </IconWrapper>
      <IconWrapper>
        <NetworkIcon size="16px" />
      </IconWrapper>
    </div>
  );
};
