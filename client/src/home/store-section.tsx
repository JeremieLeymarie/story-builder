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
import { ScrollArea, ScrollBar } from "@/design-system/primitives/scroll-area";
import { Story } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";

export const StoreSection = ({ stories }: { stories: Story[] }) => {
  return (
    <div className="flex flex-col items-center bg-accent px-32 py-4 md:items-start">
      <Title variant="secondary">Other stories from the store:</Title>
      <ScrollArea className="h-[400px] w-fit md:h-fit md:w-full">
        <div className="flex h-full w-fit flex-col gap-4 px-4 py-4 md:flex-row md:px-0">
          {stories.map((story) => (
            <StoryCard {...story} key={story.key} storyKey={story.key} />
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
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
