import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { CreateStoryForm } from "./create-story-form";
import { WithoutId } from "@/types";
import { Story } from "@/lib/storage/dexie-db";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { Link, useNavigate } from "@tanstack/react-router";
import { MoveRightIcon } from "lucide-react";

type BuilderHomeProps = {
  stories: Story[];
};

export const BuilderStories = ({ stories }: BuilderHomeProps) => {
  const navigate = useNavigate();
  // TODO: fetch stories

  const handleCreateStory = async (storyData: WithoutId<Story>) => {
    const story = await getRepository().createStory(storyData);
    navigate({
      to: "/builder/$storyId",
      params: { storyId: story.id },
    });
  };

  return (
    // TODO: justify-center might not be the best
    <div className="flex p-4 gap-4 flex-wrap justify-center">
      <Card className="border-dashed w-[275px] h-[225px]">
        <CardHeader>
          <CardTitle>New story</CardTitle>
          <CardDescription>A new adventure awaits</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <CreateStoryForm onCreate={handleCreateStory} />
        </CardContent>
      </Card>
      {stories.map(({ title, description, image, id }) => {
        return (
          <Link to="/builder/$storyId" params={{ storyId: id }}>
            <Card
              style={{
                background: `url('${image}')`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={`w-[275px] h-[225px] group relative`}
            >
              <CardHeader>
                <CardTitle className="bg-gray-50 bg-opacity-75 p-2 rounded-sm">
                  {title}
                </CardTitle>
                <CardDescription className="text-gray-50 overflow-ellipsis overflow-hidden ...">
                  {description}
                </CardDescription>
              </CardHeader>
              <Link to="/builder/$storyId" params={{ storyId: id }}>
                <Button
                  className={`absolute opacity-0 transition ease-in-out duration-300 group-hover:opacity-100 bottom-4 right-4`}
                >
                  Edit &nbsp;{" "}
                  <MoveRightIcon size="15px" className="animate-bounce" />
                </Button>
              </Link>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
