import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { MoveRightIcon, SwordIcon } from "lucide-react";
import { StoryCard, Title } from "@/design-system/components";
import { Story } from "@/lib/storage/domain";
import { ImportModal } from "@/builder/components/import-modal";

type Library = {
  stories: Story[];
  finishedGameKeys: string[];
};

/** Component that displays the current user's library
 *
 * @param {Story[]} stories Stories published in the store
 * @param {string[]} finishedGameKeys Keys of finished games
 * @returns
 */
export const Library = ({ stories, finishedGameKeys }: Library) => {
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
              const isCompleted = finishedGameKeys.includes(key);

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
                      isCompleted ? (
                        <Button
                          className={`absolute bottom-4 right-4`}
                          disabled={false}
                          variant="secondary"
                        >
                          COMPLETED
                        </Button>
                      ) : (
                        <Button
                          className={`absolute bottom-4 right-4 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100`}
                        >
                          <SwordIcon size="18px" />
                          &nbsp;Play
                        </Button>
                      )
                    }
                  />
                </Link>
              );
            })}
        </div>

        {stories.length === 0 && (
          <div>
            <p className="text-sm text-muted-foreground">
              You don't have any games in your library...
            </p>
            <Link to="/store">
              <Button variant="link" className="text-md p-0">
                Go to the store to find free adventure to play &nbsp;
                <MoveRightIcon size="15px" className="animate-bounce" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
