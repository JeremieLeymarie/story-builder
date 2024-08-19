import { Story, StoryGenre } from "@/lib/storage/domain";
import { ConfirmDownloadDialog } from "./confirm-download-dialog";
import { StoryCard } from "@/design-system/components/story-card";
import { Title } from "@/design-system/components";
import { ScrollArea } from "@/design-system/primitives/scroll-area";

type StoreHomeProps = {
  storiesByGenre: Record<StoryGenre, Story[]>;
};

export const Store = ({ storiesByGenre }: StoreHomeProps) => {
  return (
    <div className="space-y-8 p-8 px-32">
      <Title variant="secondary">Store</Title>
      <p className="text-muted-foreground">
        Embark on new adventures! Download new (free) stories from the store
      </p>
      {Object.entries(storiesByGenre).map(([genre, stories]) => (
        <>
          <Title variant="section" className="capitalize">
            {genre}
          </Title>
          <ScrollArea className="h-[400px] w-fit md:h-fit md:w-full">
            <div className="flex h-full w-fit flex-col gap-4 px-4 py-4 md:flex-row md:px-0">
              {stories.map((story) => {
                return (
                  <StoryCard
                    {...story}
                    button={<ConfirmDownloadDialog storyKey={story.key} />}
                    key={story.key}
                    storyKey={story.key}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </>
      ))}
    </div>
  );
};
