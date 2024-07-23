import { StoryCard } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Story } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";

export const StoryList = ({ stories }: { stories: Story[] }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {stories.map((storyWithKey) => {
        const { key, ...story } = storyWithKey;
        return (
          <Link to="/library/$storyKey" params={{ storyKey: key }} key={key}>
            <StoryCard
              {...story}
              storyKey={key}
              button={
                <Button
                  className={`absolute bottom-4 right-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                >
                  <MoveRightIcon size="15px" />
                </Button>
              }
            />
          </Link>
        );
      })}
    </div>
  );
};
