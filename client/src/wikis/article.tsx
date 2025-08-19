import { Logo } from "@/design-system/components/logo";
import { Button } from "@/design-system/primitives";

const EmptyState = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="bg-muted flex h-[300px] w-[400px] flex-col items-center justify-center space-y-2 rounded shadow">
        <Logo width={150} height={150} />
        <p className="text-muted-foreground italic">This wiki is empty...</p>
        <Button>Create your first article</Button>
      </div>
    </div>
  );
};

export const Article = ({ article }: { article?: unknown }) => {
  return article ? <div>TODO: Article</div> : <EmptyState />;
};
