import { StoryCard } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Story } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { SwordIcon } from "lucide-react";

export const StoryList = ({
  stories,
  finishedGameKeys,
}: {
  stories: Story[];
  finishedGameKeys: string[];
}) => {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap">
      {stories.map((storyWithKey) => {
        const { key, ...story } = storyWithKey;
        const isCompleted = finishedGameKeys.includes(key);

        return (
          <Link to="/library/$storyKey" params={{ storyKey: key }} key={key}>
            <StoryCard
              {...story}
              storyKey={key}
              button={
                isCompleted ? (
                  <Button
                    className={`absolute right-4 bottom-4`}
                    disabled={false}
                    variant="secondary"
                  >
                    COMPLETED
                  </Button>
                ) : (
                  <Button
                    className={`absolute right-4 bottom-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                  >
                    <SwordIcon size="18px" />
                    &nbsp;Play
                  </Button>
                )
              }
            />
          </Link>
        );
      })}
    </div>
  );
};
