import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { SwordIcon } from "lucide-react";
import { StoryCard, Title } from "@/design-system/components";
import { Story } from "@/lib/storage/domain";
import { ImportModal } from "@/builder/components/import-modal";

type Library = {
  stories: Story[];
};

/** Component that displays the current user's library
 *
 * @param {Story[]} stories Stories of the library
 * @returns
 */
export const Library = ({ stories }: Library) => {
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
            <CardContent className="flex flex-col items-center justify-center gap-2">
              <ImportModal />
            </CardContent>
          </Card>
          {stories.length > 0 &&
            stories.map((storyWithKey) => {
              const { key, ...story } = storyWithKey;

              return (
                <Link
                  to="/library/$storyKey"
                  params={{ storyKey: key }}
                  key={key}
                >
                  <StoryCard
                    {...story}
                    storyKey={key}
                    button={
                      <Button
                        className={`absolute bottom-4 right-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                      >
                        <SwordIcon size="18px" />
                        &nbsp;Play
                      </Button>
                    }
                  />
                </Link>
              );
            })}
        </div>

        {stories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You don't have any games in your library...
          </p>
        )}
      </div>
    </div>
  );
};
