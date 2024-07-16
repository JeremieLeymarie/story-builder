import { Button } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";
import { Story } from "@/lib/storage/dexie/dexie-db";
import { StoryCard } from "@/design-system/components/story-card";

type Library = {
  stories: Story[];
};

export const Library = ({ stories }: Library) => {
  return (
    // TODO: justify-center might not be the best
    <div className="flex p-4 gap-4 flex-wrap justify-center">
      {stories.map((story) => {
        return (
          <Link
            to="/library/$storyId"
            params={{ storyId: story.id }}
            key={story.id}
          >
            <StoryCard
              {...story}
              button={
                <Button
                  className={`absolute opacity-0 transition ease-in-out duration-300 group-hover:opacity-100 bottom-4 right-4`}
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
