import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { StoryFormDialog } from "./story-form/story-form-dialog";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon, PlusIcon } from "lucide-react";
import { useBuilderStories } from "../hooks/use-builder-stories";
import { StoryCard } from "@/design-system/components/story-card";
import { Story } from "@/lib/storage/domain";
import { Title } from "@/design-system/components";

type BuilderHomeProps = {
  stories: Story[];
};

export const BuilderStories = ({ stories }: BuilderHomeProps) => {
  const { handleCreateStory } = useBuilderStories();

  return (
    <div className="flex flex-col items-center space-y-8 px-16 py-8 sm:items-start sm:px-32">
      <Title variant="secondary">Builder</Title>
      <p className="text-muted-foreground">
        All the stories you've created are here.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Card className="h-[225px] w-[275px] border-dashed">
          <CardHeader>
            <CardTitle>New story</CardTitle>
            <CardDescription>A new adventure awaits</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2">
            <StoryFormDialog
              onSubmit={handleCreateStory}
              trigger={
                <Button>
                  <PlusIcon /> &nbsp;Build your own story
                </Button>
              }
              title="Your story"
              description="Build your own adventure!"
            />
          </CardContent>
        </Card>
        {stories.map((story) => {
          const { key, ...storyWithoutKey } = story;
          return (
            <Link
              key={key}
              to="/builder/$storyKey"
              params={{ storyKey: story.key }}
            >
              <StoryCard
                {...storyWithoutKey}
                storyKey={key}
                button={
                  <Link
                    to="/builder/$storyKey"
                    params={{ storyKey: story.key }}
                  >
                    <Button
                      className={`absolute right-4 bottom-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                    >
                      Edit &nbsp;{" "}
                      <MoveRightIcon size="15px" className="animate-bounce" />
                    </Button>
                  </Link>
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
