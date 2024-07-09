import { StoryCard } from "@/design-system/components/story-card";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from "@/design-system/primitives";
import { Story } from "@/lib/storage/dexie/dexie-db";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";

export const StoreItems = ({ stories }: { stories: Story[] }) => {
  return (
    <div className="bg-accent flex flex-col items-center py-4 px-8 md:items-start">
      <p className="text-2xl mt-2 mb-6 px-3 py-1 font-semibold text-underline rounded-[--radius] bg-primary w-max ">
        Other stories from the store:
      </p>
      <div className="w-full flex p-4 gap-8 flex-wrap justify-center">
        {stories.map((story) => (
          <StoryCard {...story} key={story.id} />
        ))}
        <Card className="border-dashed w-[275px] h-[225px]">
          <CardHeader>
            <CardTitle>...and many others!</CardTitle>
            <CardDescription>
              Dozens of adventures are waiting for you!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <Link to="/builder/stories">
              <Button>
                Go to store &nbsp; <MoveRightIcon />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
