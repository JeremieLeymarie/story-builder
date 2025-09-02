import { Title } from "@/design-system/components";
import { Toolbar } from "@/design-system/components/toolbar";
import { Input } from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { SearchIcon } from "lucide-react";

const Article = ({ title }: { title: string }) => {
  return (
    <p className="hover:bg-accent text-md w-full truncate rounded py-1 pl-2">
      {title}
    </p>
  );
};

const Section = ({ title }: { title: string }) => {
  return (
    <div>
      <Title variant="sub-section">{title}</Title>
      <div className="mt-1">
        <Article title="Article #1" />
        <Article title="Article #2" />
        <Article title="Article #3" />
      </div>
    </div>
  );
};

export const WikiBar = () => {
  return (
    <Toolbar className="w-[300px] space-y-3">
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4" />
        <Input placeholder="Search" className="pl-9" />
      </div>

      <div className="grid">
        {/* TODO: get categories from db  */}
        <ScrollArea className="max-h-[calc(100dvh-175px)]">
          <Section title="People" />
          <Section title="Geography" />
          <Section title="Event" />
          <Section title="Culture" />
        </ScrollArea>
      </div>
    </Toolbar>
  );
};
