import { Title } from "@/design-system/components";
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
    <div className="flex flex-col items-center bg-accent px-8 py-4 md:items-start">
      <Title variant="secondary">Other stories from the store:</Title>
      <div className="flex w-full flex-wrap justify-center gap-8 p-4">
        {stories.map((story) => (
          <StoryCard {...story} key={story.key} />
        ))}
        <Card className="h-[225px] w-[275px] border-dashed">
          <CardHeader>
            <CardTitle>...and many others!</CardTitle>
            <CardDescription>
              Dozens of adventures are waiting for you!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Link to="/store">
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
