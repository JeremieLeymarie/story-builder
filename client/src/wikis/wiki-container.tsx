import { WikiBar } from "./wiki-bar";
import { ReactNode } from "react";

export const WikiContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-full gap-4 p-4">
      <WikiBar />
      <div className="w-full">{children}</div>
    </div>
  );
};
