import { Wiki } from "@/lib/storage/domain";
import { WikiBar } from "./wiki-bar";
import { Article } from "./article";

export const WikiContent = (_props: { wiki: Wiki; refresh: () => void }) => {
  return (
    <div className="flex h-full gap-4 p-4">
      <WikiBar />
      <Article />
    </div>
  );
};
