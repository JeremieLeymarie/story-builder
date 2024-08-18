import { StoryCard, Title } from "@/design-system/components";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { ScrollArea, ScrollBar } from "@/design-system/primitives/scroll-area";
import { Story } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";

export const LibrarySection = ({ stories }: { stories: Story[] }) => {
  return (
    <div className="flex flex-col items-center bg-accent px-32 py-4 md:items-start">
      <Title variant="secondary">Stories from your library:</Title>
      <ScrollArea className="h-[400px] w-fit md:h-fit md:w-full">
        <div className="flex h-full w-fit flex-col gap-4 px-4 py-4 md:flex-row md:px-0">
          {stories.map((story) => (
            <Link
              to="/library/$storyKey"
              params={{ storyKey: story.key }}
              key={story.key}
            >
              <StoryCard {...story} />
            </Link>
          ))}
          <Card className="h-[225px] w-[275px] border-dashed">
            <CardHeader>
              <CardTitle>...and many others!</CardTitle>
              <CardDescription>
                Dozens of adventures are waiting for you!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Link to="/library">
                <Button>
                  Go to library &nbsp; <MoveRightIcon />
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
