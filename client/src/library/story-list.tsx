import { StoryCard } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Story } from "@/lib/storage/domain";
import { useNavigate } from "@tanstack/react-router";
import { SwordIcon } from "lucide-react";

export const StoryList = ({
  stories,
  finishedGameKeys,
}: {
  stories: Story[];
  finishedGameKeys: string[];
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap">
      {stories.map((story) => {
        const isCompleted = finishedGameKeys.includes(story.key);

        return (
          <StoryCard
            key={story.key}
            onClick={() =>
              navigate({
                to: "/library/$storyKey",
                params: { storyKey: story.key },
              })
            }
            story={story}
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
        );
      })}
    </div>
  );
};
