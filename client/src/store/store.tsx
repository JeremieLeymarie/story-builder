import { Story } from "../lib/storage/dexie/dexie-db";
import { ConfirmDownloadDialog } from "./confirm-download-dialog";
import { StoryCard } from "@/design-system/components/story-card";

type StoreHomeProps = {
  stories: Story[];
};

export const Store = ({ stories }: StoreHomeProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stories.map((story) => {
        return (
          <StoryCard
            {...story}
            button={<ConfirmDownloadDialog storyKey={story.key} />}
            key={story.key}
          />
        );
      })}
    </div>
  );
};
