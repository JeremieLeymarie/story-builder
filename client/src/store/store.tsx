import { Story } from "@/lib/storage/domain";
import { ConfirmDownloadDialog } from "./confirm-download-dialog";
import { StoryCard } from "@/design-system/components/story-card";

type StoreHomeProps = {
  stories: Story[];
};

export const Store = ({ stories }: StoreHomeProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stories.map((story) => {
        const { key, ...storyWithoutKey } = story;
        return (
          <StoryCard
            {...storyWithoutKey}
            button={<ConfirmDownloadDialog storyKey={story.key} />}
            key={key}
            storyKey={key}
          />
        );
      })}
    </div>
  );
};
