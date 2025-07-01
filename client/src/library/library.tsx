import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { useNavigate } from "@tanstack/react-router";
import { BracesIcon, SwordIcon } from "lucide-react";
import { StoryCard, Title } from "@/design-system/components";
import { Story } from "@/lib/storage/domain";
import { ImportModal } from "@/design-system/components/import-modal";
import { toast } from "sonner";
import { getLibraryService } from "@/domains/game/library-service";
import {
  getImportService,
  StoryFromImport,
} from "@/services/common/import-service";

type Library = {
  stories: Story[];
};

/** Component that displays the current user's library
 *
 * @param {Story[]} stories Stories of the library
 * @returns
 */
export const Library = ({ stories }: Library) => {
  const navigate = useNavigate();

  const parseFile = (content: string) => {
    const result = getImportService().parseJSON(content);

    if (!result.isOk) {
      toast.error("Import failed", { description: result.error });
      return null;
    }
    return result.data;
  };

  const importStory = async (storyFromImport: StoryFromImport) => {
    const { error } = await getLibraryService().importStory(storyFromImport);
    if (error) {
      toast.error("Import failed!", { description: error });
      return;
    }

    toast.success("Import complete!", {
      description: "Game was successfully downloaded on this device.",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8 px-16 sm:items-start sm:px-32">
      <div className="flex flex-col items-center space-y-8 sm:items-start">
        <Title variant="secondary">Your games</Title>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap">
          <Card className="h-[225px] w-[275px] border-dashed">
            <CardHeader>
              <CardTitle>Import your game</CardTitle>
              <CardDescription>Import a story from a JSON file</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col items-center justify-center gap-2">
              <ImportModal
                onImportStory={importStory}
                parseFile={parseFile}
                trigger={
                  <Button size="sm">
                    <BracesIcon size="16px" />
                    &nbsp; Import from JSON
                  </Button>
                }
              />
            </CardContent>
          </Card>
          {stories.length > 0 &&
            stories.map((story) => {
              return (
                <StoryCard
                  key={story.key}
                  onClick={() =>
                    navigate({
                      to: "/library/$storyKey",
                      params: { storyKey: story.key },
                    })
                  }
                  story={story}
                  button={
                    <Button
                      className={`absolute right-4 bottom-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                    >
                      <SwordIcon size="18px" />
                      &nbsp;Play
                    </Button>
                  }
                />
              );
            })}
        </div>

        {stories.length === 0 && (
          <p className="text-muted-foreground text-sm">
            You don't have any games in your library...
          </p>
        )}
      </div>
    </div>
  );
};
