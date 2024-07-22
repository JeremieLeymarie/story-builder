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
import { Story } from "@/lib/storage/dexie/dexie-db";
import { ImportModal } from "../components/import-modal";
import { StoryCard } from "@/design-system/components/story-card";

type BuilderHomeProps = {
  stories: Story[];
};

export const BuilderStories = ({ stories }: BuilderHomeProps) => {
  const { handleCreateStory } = useBuilderStories();

  return (
    // TODO: justify-center might not be the best
    <div className="flex flex-wrap justify-center gap-4 p-4">
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
          <p className="text-sm text-muted-foreground">------ OR ------</p>
          <ImportModal />
        </CardContent>
      </Card>
      {stories.map((story) => {
        return (
          <StoryCard
            {...story}
            key={story.key}
            button={
              <Link to="/builder/$storyKey" params={{ storyKey: story.key }}>
                <Button
                  className={`absolute bottom-4 right-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                >
                  Edit &nbsp;{" "}
                  <MoveRightIcon size="15px" className="animate-bounce" />
                </Button>
              </Link>
            }
          />
        );
      })}
    </div>
  );
};
