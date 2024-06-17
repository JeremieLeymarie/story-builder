import {
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
import { useNavigate } from "@tanstack/react-router";

export const BuilderHome = () => {
  const navigate = useNavigate();
  // TODO: fetch stories

  const handleCreateStory = async (storyData: WithoutId<Story>) => {
    const story = await getRepository().createStory(storyData);
    navigate({
      to: "/builder/$storyId",
      params: { storyId: story.id.toString() },
    });
  };

  return (
    <div className="flex p-4">
      <Card className="border-dashed max-w-[450px] max-h-[400px]">
        <CardHeader>
          <CardTitle>New story</CardTitle>
          <CardDescription>A new adventure awaits</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <CreateStoryForm onCreate={handleCreateStory} />
        </CardContent>
      </Card>
      {/* TODO: display stories  */}
    </div>
  );
};
