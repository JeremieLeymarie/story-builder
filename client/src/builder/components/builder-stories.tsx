import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { StoryFormDialog } from "./story-form-dialog";
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
    <div className="flex p-4 gap-4 flex-wrap justify-center">
      <Card className="border-dashed w-[275px] h-[225px]">
        <CardHeader>
          <CardTitle>New story</CardTitle>
          <CardDescription>A new adventure awaits</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center gap-2">
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
            key={story.id}
            {...story}
            button={
              <Link to="/builder/$storyId" params={{ storyId: story.id }}>
                <Button
                  className={`absolute opacity-0 transition ease-in-out duration-300 group-hover:opacity-100 bottom-4 right-4`}
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
